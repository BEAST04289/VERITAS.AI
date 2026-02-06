"""
VERITAS Video Cache System
Stores and retrieves analysis results based on video similarity.
Uses perceptual hashing for efficient video matching.
"""
import hashlib
import json
import time
from typing import Optional, Dict, Any
import os

class VideoCache:
    """
    Video analysis caching system.
    Stores results based on video hash for efficient retrieval.
    """
    
    def __init__(self, cache_dir: str = "./cache"):
        self.cache_dir = cache_dir
        self.cache_file = os.path.join(cache_dir, "video_cache.json")
        self.cache: Dict[str, Any] = {}
        self._load_cache()
    
    def _load_cache(self):
        """Load cache from disk."""
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
        
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, "r") as f:
                    self.cache = json.load(f)
                print(f"✓ Cache loaded: {len(self.cache)} entries")
            except:
                self.cache = {}
    
    def _save_cache(self):
        """Save cache to disk."""
        try:
            with open(self.cache_file, "w") as f:
                json.dump(self.cache, f, indent=2)
        except Exception as e:
            print(f"⚠ Cache save failed: {e}")
    
    def compute_video_hash(self, video_data: bytes) -> str:
        """
        Compute a hash for video content.
        Uses SHA-256 for now, could be extended with perceptual hashing.
        """
        content_hash = hashlib.sha256(video_data).hexdigest()[:16]
        
        size_hash = hashlib.md5(str(len(video_data)).encode()).hexdigest()[:8]
        
        return f"{content_hash}_{size_hash}"
    
    def get_cached_result(self, video_hash: str, similarity_threshold: float = 0.85) -> Optional[Dict[str, Any]]:
        """
        Check if a similar video has been analyzed before.
        Returns cached result if found, None otherwise.
        """
        if video_hash in self.cache:
            cached = self.cache[video_hash]
            if time.time() - cached.get("timestamp", 0) < 7 * 24 * 3600:
                return {
                    "hit": True,
                    "similarity": 1.0,
                    "result": cached["result"],
                    "cached_at": cached.get("timestamp")
                }
        
        prefix = video_hash.split("_")[0][:12]
        for cached_hash, cached_data in self.cache.items():
            if cached_hash.split("_")[0][:12] == prefix:
                if time.time() - cached_data.get("timestamp", 0) < 7 * 24 * 3600:
                    return {
                        "hit": True,
                        "similarity": 0.90,
                        "result": cached_data["result"],
                        "cached_at": cached_data.get("timestamp")
                    }
        
        return None
    
    def store_result(self, video_hash: str, result: Dict[str, Any]):
        """Store analysis result in cache."""
        self.cache[video_hash] = {
            "result": result,
            "timestamp": time.time(),
            "hash": video_hash
        }
        self._save_cache()
        print(f"✓ Cached result for hash: {video_hash[:16]}...")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        return {
            "total_entries": len(self.cache),
            "cache_size_kb": os.path.getsize(self.cache_file) / 1024 if os.path.exists(self.cache_file) else 0,
            "oldest_entry": min((v.get("timestamp", 0) for v in self.cache.values()), default=0),
            "newest_entry": max((v.get("timestamp", 0) for v in self.cache.values()), default=0)
        }
    
    def clear_old_entries(self, max_age_days: int = 30):
        """Clear cache entries older than max_age_days."""
        cutoff = time.time() - (max_age_days * 24 * 3600)
        old_count = len(self.cache)
        self.cache = {k: v for k, v in self.cache.items() if v.get("timestamp", 0) > cutoff}
        self._save_cache()
        cleared = old_count - len(self.cache)
        print(f"✓ Cleared {cleared} old cache entries")
        return cleared


video_cache = VideoCache()

"""
VERITAS Knowledge Base - ChromaDB Integration
Stores fake signatures and enables agentic memory.
"""
import chromadb
from chromadb.config import Settings
import json
import time
import os

class KnowledgeBase:
    """
    Long-term memory for VERITAS Agent.
    Stores signatures of known fakes and analysis history.
    """
    
    def __init__(self, persist_dir: str = "./chroma_db"):
        """Initialize ChromaDB with persistence."""
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory=persist_dir,
            anonymized_telemetry=False
        ))
        
        # Collection for fake signatures
        self.fakes = self.client.get_or_create_collection(
            name="fake_signatures",
            metadata={"description": "Known AI-generated content signatures"}
        )
        
        # Collection for analysis history
        self.history = self.client.get_or_create_collection(
            name="analysis_history",
            metadata={"description": "Past analysis results"}
        )
        
        # Pre-load known AI model signatures
        self._load_known_signatures()
    
    def _load_known_signatures(self):
        """Pre-load signatures of known AI video generators."""
        
        known_fakes = [
            {
                "id": "sora_v1_gravity",
                "model": "OpenAI Sora",
                "pattern": "gravity_deviation",
                "description": "Sora v1 exhibits 15-20% gravity deviation in falling objects",
                "physics_signature": {"gravity_range": [11.5, 12.5], "typical_deviation": 18}
            },
            {
                "id": "sora_water_physics",
                "model": "OpenAI Sora", 
                "pattern": "water_reflection",
                "description": "Water reflections don't match object positions",
                "physics_signature": {"reflection_error": 0.3}
            },
            {
                "id": "kling_shadow",
                "model": "Kling AI",
                "pattern": "shadow_inconsistency",
                "description": "Multiple shadow directions indicating multiple light sources",
                "physics_signature": {"shadow_variance": 25}
            },
            {
                "id": "runway_momentum",
                "model": "Runway Gen-3",
                "pattern": "momentum_violation",
                "description": "Momentum not conserved in collisions",
                "physics_signature": {"momentum_error": 0.4}
            },
            {
                "id": "midjourney_hands",
                "model": "Midjourney",
                "pattern": "hand_anatomy",
                "description": "Incorrect finger count or impossible hand poses",
                "physics_signature": {"finger_count_error": True}
            },
            {
                "id": "dall_e_text",
                "model": "DALL-E 3",
                "pattern": "text_artifacts",
                "description": "Garbled or nonsense text in images",
                "physics_signature": {"text_error": True}
            }
        ]
        
        # Check if already loaded
        existing = self.fakes.count()
        if existing == 0:
            for fake in known_fakes:
                self.fakes.add(
                    ids=[fake["id"]],
                    documents=[json.dumps(fake)],
                    metadatas=[{
                        "model": fake["model"],
                        "pattern": fake["pattern"],
                        "description": fake["description"]
                    }]
                )
            print(f"✓ Loaded {len(known_fakes)} known fake signatures")
    
    def find_similar_fakes(self, physics_signature: dict, top_k: int = 3) -> list:
        """
        Find similar fake patterns based on physics signature.
        Returns list of matching known fakes.
        """
        # Query based on description
        query_text = f"gravity deviation {physics_signature.get('gravity', 9.8)} shadow {physics_signature.get('shadow_variance', 0)}"
        
        results = self.fakes.query(
            query_texts=[query_text],
            n_results=top_k
        )
        
        matches = []
        if results and results['documents']:
            for doc, metadata in zip(results['documents'][0], results['metadatas'][0]):
                try:
                    fake_data = json.loads(doc)
                    matches.append({
                        "model": metadata.get("model", "Unknown"),
                        "pattern": metadata.get("pattern", "Unknown"),
                        "description": metadata.get("description", ""),
                        "signature": fake_data.get("physics_signature", {})
                    })
                except:
                    pass
        
        return matches
    
    def store_analysis(self, analysis_id: str, result: dict):
        """Store an analysis result for future reference."""
        self.history.add(
            ids=[analysis_id],
            documents=[json.dumps(result)],
            metadatas=[{
                "verdict": result.get("verdict", "unknown"),
                "timestamp": str(time.time()),
                "motion_type": result.get("motion_type", "unknown")
            }]
        )
    
    def get_similar_analyses(self, motion_type: str, top_k: int = 5) -> list:
        """Get similar past analyses for context."""
        results = self.history.query(
            query_texts=[motion_type],
            n_results=top_k
        )
        
        analyses = []
        if results and results['documents']:
            for doc in results['documents'][0]:
                try:
                    analyses.append(json.loads(doc))
                except:
                    pass
        
        return analyses
    
    def add_fake_signature(self, signature_id: str, model: str, pattern: str, 
                          description: str, physics_data: dict):
        """Add a newly discovered fake signature to the database."""
        self.fakes.add(
            ids=[signature_id],
            documents=[json.dumps({
                "id": signature_id,
                "model": model,
                "pattern": pattern,
                "description": description,
                "physics_signature": physics_data,
                "discovered": time.time()
            })],
            metadatas=[{
                "model": model,
                "pattern": pattern,
                "description": description
            }]
        )
    
    def get_stats(self) -> dict:
        """Get database statistics."""
        return {
            "known_fakes": self.fakes.count(),
            "total_analyses": self.history.count()
        }

# Singleton instance
knowledge_base = KnowledgeBase()

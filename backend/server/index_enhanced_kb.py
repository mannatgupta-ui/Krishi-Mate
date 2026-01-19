import sys
import os

# Add server directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from vector_db import add_to_db

def index_text_file(filepath):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by double newline or headers to create meaningful chunks
    sections = content.split('##')
    
    docs = []
    ids = []
    metadatas = []

    for i, section in enumerate(sections):
        if not section.strip():
            continue
        
        # Further split sections into smaller chunks if they are too large
        chunks = section.split('\n\n')
        for j, chunk in enumerate(chunks):
            if len(chunk.strip()) < 50:
                continue
                
            doc_text = chunk.strip()
            # If section doesn't start with a header in the chunk, prepend a bit of context
            if i > 0 and not doc_text.startswith('#'):
                header = section.split('\n')[0].strip()
                doc_text = f"Category: {header}\n{doc_text}"

            docs.append(doc_text)
            ids.append(f"enhanced_kb_{i}_{j}")
            metadatas.append({"source": "enhanced_knowledge_base.txt", "type": "manual_curation"})

    print(f"Found {len(docs)} chunks. Adding to database...")
    add_to_db(docs, ids, metadatas)
    print("Enhanced Knowledge Base indexed successfully!")

if __name__ == "__main__":
    kb_path = os.path.join(os.path.dirname(__file__), "enhanced_knowledge_base.txt")
    index_text_file(kb_path)

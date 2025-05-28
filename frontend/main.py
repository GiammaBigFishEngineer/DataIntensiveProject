# Backend - FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy data loading for example purposes
base_path = os.path.join("dataset", "archive")
df_review = pd.read_csv(os.path.join(base_path, "reviews_0-250.csv"), low_memory=False)  # Deve avere: author_id, product_id, rating
df_product = pd.read_csv(os.path.join(base_path, "product_info.csv"))  # Deve avere: product_id, product_name

# Preprocessing
user_item_matrix = df_review.pivot_table(index='author_id', columns='product_id', values='rating', fill_value=0)
svd = TruncatedSVD(n_components=50, random_state=42)
user_embeddings = svd.fit_transform(user_item_matrix)

@app.get("/recommend/{author_id}")
def recommend(author_id: str, top_n: int = 5):
    if author_id not in user_item_matrix.index:
        return []

    user_idx = user_item_matrix.index.get_loc(author_id)
    user_vector = svd.transform(user_item_matrix)[user_idx]
    product_embeddings = svd.components_.T
    scores = np.dot(product_embeddings, user_vector)

    seen_products = user_item_matrix.loc[author_id]
    unseen_product_ids = seen_products[seen_products == 0].index

    ranked = sorted([
        (pid, scores[user_item_matrix.columns.get_loc(pid)])
        for pid in unseen_product_ids
    ], key=lambda x: x[1], reverse=True)[:top_n]

    result = []
    for pid, score in ranked:
        name = df_product[df_product['product_id'] == pid]['product_name'].values
        result.append({
            "product_id": pid,
            "product_name": name[0] if len(name) > 0 else "N/A",
            "score": float(score) #stima della preferenza dell'utente
        })
    return result

@app.get("/users")
def get_user_ids():
    user_ids = user_item_matrix.index.tolist()
    print(f"Totale utenti: {len(user_ids)}")
    return user_ids


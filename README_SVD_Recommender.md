# 📊 Sistema di Raccomandazione con SVD

Questo progetto implementa un **sistema di raccomandazione** utilizzando **Collaborative Filtering** basato su **SVD (Singular Value Decomposition)** per consigliare prodotti a partire dalle valutazioni degli utenti.

---

## 🚀 Tecnologie usate

- Python
- pandas
- numpy
- scikit-learn (TruncatedSVD)

---

## 📁 Struttura dei dati

### Dataset `df_review`

Contiene le recensioni con le seguenti colonne:
- `author_id`: identificativo dell’utente
- `product_id`: identificativo del prodotto
- `rating`: valutazione assegnata (es. da 1 a 5)

### Dataset `df_product`

Contiene i metadati dei prodotti:
- `product_id`: identificativo
- `product_name`: nome del prodotto

---

## 🔧 Come funziona

### 1. Pulizia del dataset

I valori mancanti nei campi chiave vengono rimossi per evitare errori.

### 2. Costruzione della matrice utente-prodotto

Si crea una matrice `user_item_matrix` in cui:
- Le righe sono gli utenti
- Le colonne sono i prodotti
- Le celle contengono i rating (0 se l’utente non ha valutato quel prodotto)

### 3. Riduzione della dimensionalità con SVD

Si applica `TruncatedSVD` per rappresentare ogni utente e ogni prodotto in uno spazio latente a 50 dimensioni.

### 📐 Teoria: SVD

La **Singular Value Decomposition** fattorizza una matrice \( M \) come:

\[
M \approx U \Sigma V^T
\]

Dove:
- \( M \) è la matrice utente-prodotto
- \( U \) è la matrice degli **embedding utente**
- \( \Sigma \) è una matrice diagonale con i **valori singolari**
- \( V^T \) è la matrice degli **embedding dei prodotti**

In pratica:
- Ogni utente e prodotto viene rappresentato in uno spazio latente
- Si catturano **pattern nascosti** di preferenza

---

### 4. Calcolo delle raccomandazioni

Per un utente specifico:
- Si genera il suo embedding (\( U \))
- Si calcola il prodotto scalare tra questo embedding e quelli dei prodotti (\( V^T \))
- Si ordinano i prodotti non ancora visti per score decrescente

---

## 📌 Esempio di utilizzo

```python
# Ottieni raccomandazioni per un utente
sample_user = df_review['author_id'].dropna().unique()[5]
recommendations = recommend_products(sample_user, user_item_matrix, svd, top_n=5)

for pid, score in recommendations:
    name = df_product[df_product['product_id'] == pid]['product_name'].values
    print(f"Product ID: {pid}, Score: {score:.3f}, Name: {name[0] if len(name) > 0 else 'N/A'}")
```

---

## 🧠 Metodo `recommend_products`

```python
def recommend_products(author_id, user_item_matrix, svd_model, top_n=5):
    ...
    return [(product_id, score), ...]
```

Restituisce una lista di tuple contenenti:
- `product_id`: identificativo del prodotto consigliato
- `score`: stima del gradimento da parte dell’utente

---

## 📈 Possibili Estensioni

- Aggiunta di metriche di valutazione (es. RMSE, Precision@K)
- Integrazione con un sistema basato su contenuto (Content-Based)
- Visualizzazione grafica degli embedding
- Interfaccia web o API con FastAPI / Flask

---

## 🧪 Requisiti

```bash
pip install pandas numpy scikit-learn
```

---

## 📬 Contatti

Realizzato da: **[Gianmaria Di Fronzo]**  
Email: `gianmaria.difronzo@unibo.it`

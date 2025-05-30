# 🧠 Sistema di Raccomandazione Content-Based (TF-IDF + Similarità Coseno)

Questo sistema di raccomandazione suggerisce prodotti simili sulla base delle **caratteristiche testuali** di ciascun prodotto. Si tratta di un approccio **content-based filtering** che utilizza **TF-IDF** per rappresentare il contenuto e **similarità coseno** per determinare la vicinanza tra i prodotti.

---

## 🚀 Tecnologie usate

- Python
- pandas
- scikit-learn (`TfidfVectorizer`, `linear_kernel`)

---

## 📁 Struttura dei dati

Il dataset `df_product` contiene colonne testuali utili per descrivere un prodotto:

- `brand_name`
- `primary_category`, `secondary_category`, `tertiary_category`
- `ingredients`
- `highlights`
- `size`

---

## 🔧 Come funziona

### 1. Pulizia dei dati

Si sostituiscono i valori `NaN` con stringhe vuote nelle colonne testuali, per evitare problemi nella concatenazione del testo.

### 2. Combinazione dei campi testuali

Si crea una nuova colonna `content` combinando tutte le caratteristiche testuali per ogni prodotto:

```python
df_product['content'] = (
    df_product['brand_name'] + ' ' +
    df_product['primary_category'] + ' ' +
    df_product['secondary_category'] + ' ' +
    df_product['tertiary_category'] + ' ' +
    df_product['ingredients'] + ' ' +
    df_product['highlights'] + ' ' +
    df_product['size']
)
```

---

### 3. Vettorizzazione con TF-IDF

Si usa `TfidfVectorizer` per trasformare il testo in una matrice numerica che rappresenta l'importanza di ciascun termine per ogni prodotto:

```python
tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
tfidf_matrix = tfidf.fit_transform(df_product['content'])
```

---

### 4. Similarità Coseno

La **similarità coseno** misura quanto due prodotti sono simili osservando l’angolo tra i loro vettori TF-IDF:

- Se l’angolo è piccolo ⇒ prodotti molto simili
- Se l’angolo è grande ⇒ prodotti diversi

Formula della similarità coseno:

\[
\text{sim}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}
\]

Dove:
- \( A \cdot B \) è il prodotto scalare tra i vettori
- \( \|A\| \) e \( \|B\| \) sono le norme (lunghezze) dei vettori

In codice:

```python
from sklearn.metrics.pairwise import linear_kernel
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
```

---

### 5. Raccomandazione di prodotti simili

La funzione `recommend_similar_products` restituisce i prodotti più simili a quello passato:

```python
def recommend_similar_products(product_id, df_product, cosine_sim, top_n=5):
    ...
```

---

## 📌 Esempio

```python
sample_product = df_product['product_id'].iloc[0]
recommendations = recommend_similar_products(sample_product, df_product, cosine_sim)

print("Prodotti simili a:", df_product[df_product['product_id'] == sample_product]['product_name'].values[0])
print(recommendations)
```

---

## ✅ In sintesi

- 🔍 Approccio: **Content-Based Filtering**
- 🔡 Feature: Testo combinato da più colonne
- 🔢 Tecnica: **TF-IDF + Similarità Coseno**
- 🎯 Obiettivo: Trovare prodotti semanticamente simili

---

## 📬 Contatti

Realizzato da: **[Gianmaria Di Fronzo]**  
Email: `gianmaria.difronzo@unibo.it`

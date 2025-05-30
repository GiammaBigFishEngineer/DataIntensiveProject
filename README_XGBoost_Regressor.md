# 🌲 Regressione con XGBoost e Ottimizzazione con RandomizedSearchCV

Questo progetto implementa un modello di **regressione** usando **XGBoost (XGBRegressor)** e ne ottimizza le prestazioni tramite **RandomizedSearchCV**. È progettato per trovare i migliori iperparametri in modo efficiente e migliorare le prestazioni predittive.

---

## 🚀 Tecnologie usate

- Python
- pandas
- numpy
- scikit-learn
- xgboost
- scipy (per le distribuzioni)

---

## 📁 Dataset

- `X_train`, `X_test`: feature numeriche per l’addestramento e test
- `y_train`, `y_test`: target della regressione (es. prezzo, punteggio, ecc.)

---

## 🔧 Fasi principali

### 1. Addestramento base

Si crea un modello iniziale con XGBoost:

```python
model = XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.1)
model.fit(X_train, y_train)
```

### 2. Valutazione iniziale

```python
y_pred = model.predict(X_test)
rmse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
```

- **RMSE**: radice dell'errore quadratico medio
- **R2**: coefficiente di determinazione, indica la varianza spiegata dal modello

---

## 🌳 Teoria: Regressione con XGBoost

XGBoost è una libreria di **gradient boosting** che crea un insieme di alberi (ensemble) in modo sequenziale.

### 🧠 Obiettivo:

Minimizzare una **funzione obiettivo** della forma:

\[
\mathcal{L}(\theta) = \sum_{i=1}^{n} l(y_i, \hat{y}_i) + \sum_{k=1}^{K} \Omega(f_k)
\]

- \( l \): funzione di perdita (es. MSE)
- \( \Omega(f) = \gamma T + \frac{1}{2} \lambda ||w||^2 \): termine di regolarizzazione per controllare complessità dell’albero
- \( f_k \): ciascun albero
- \( T \): numero di foglie
- \( w \): punteggi assegnati alle foglie

---

## 🎯 Ottimizzazione con RandomizedSearchCV

### Perché usarlo?

- `GridSearchCV`: esplora **tutte** le combinazioni (molto lento)
- `RandomizedSearchCV`: esplora un **sottoinsieme casuale** delle combinazioni (molto più veloce)

### Funzionamento:

Per ogni iterazione:
1. Estrae una combinazione casuale di iperparametri
2. Valuta le prestazioni tramite **cross-validation**
3. Salva la combinazione con il miglior punteggio

### Esempio:

```python
param_dist = {
    'n_estimators': randint(50, 150),
    'max_depth': randint(3, 7),
    'learning_rate': uniform(0.05, 0.2),
    ...
}

random_search = RandomizedSearchCV(
    estimator=XGBRegressor(),
    param_distributions=param_dist,
    n_iter=5,
    cv=3,
    scoring='neg_mean_squared_error'
)
```

### Cross-Validation

Per ogni combinazione, RandomizedSearchCV divide i dati in `k` parti (fold) e valuta:

\[
\text{Errore medio} = \frac{1}{k} \sum_{i=1}^{k} MSE_i
\]

---

## 🧪 Esempio di uso pratico

```python
X_sample, _, y_sample, _ = train_test_split(X_train, y_train, train_size=0.3)
random_search.fit(X_sample, y_sample)

best_model = random_search.best_estimator_
y_best_pred = best_model.predict(X_test)
```

---

## 📈 Metriche finali

- **RMSE** ottimizzato
- **R2** ottimizzato

Permettono di confrontare il modello iniziale e quello ottimizzato.

---

## 📬 Contatti

Realizzato da: **[Gianmaria Di Fronzo]**  
Email: `gianmaria.difronzo@unibo.it`

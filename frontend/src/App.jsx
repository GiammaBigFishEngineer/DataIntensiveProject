import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

function App() {
  const [authorId, setAuthorId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 100;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/users");
        const options = res.data.map((id) => ({ value: id, label: id }));
        console.log("Opzioni caricate:", options);
        setUserOptions(options);
        setUserList(res.data);
      } catch (error) {
        console.error("Errore nel caricamento utenti:", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchRecommendations = async () => {
    if (!authorId) return;
    setLoading(true); // Inizia caricamento
    try {
      const res = await axios.get(`http://127.0.0.1:8000/recommend/${authorId}`);
      setRecommendations(res.data);
    } catch (error) {
      console.error("Errore nel recupero delle raccomandazioni:", error);
    }
    setLoading(false); // Fine caricamento
  };

  // Calcola gli utenti da mostrare nella pagina corrente
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(userList.length / usersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Colonna sinistra: Sistema di raccomandazione */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4"><i className="bi bi-stars me-2"></i> Sistema di Raccomandazione</h2>

              <div className="mb-3">
                <label className="form-label">Inserisci ID Utente</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Esempio: 10000015049"
                  value={authorId || ""}
                  onChange={(e) => setAuthorId(e.target.value)}
                />
              </div>


              <button
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                onClick={fetchRecommendations}
                disabled={!authorId || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Caricamento...
                  </>
                ) : (
                  <>
                    <i className="bi bi-rocket-takeoff me-2"></i> Ottieni Raccomandazioni
                  </>
                )}
              </button>

              <hr className="my-4" />

              {recommendations.length > 0 && (
                <>
                  <h5 className="text-center">Prodotti Consigliati:</h5>
                  <ul className="list-group mt-3">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                          <strong>{rec.product_name}</strong><br />
                          <small className="text-muted">ID: {rec.product_id}</small>
                        </span>
                        <span className="badge bg-success rounded-pill">
                          {rec.score.toFixed(3)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Colonna destra: Tabella utenti con paginazione */}
        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title text-center mb-3"><i className="bi bi-people-fill me-2"></i> Lista Utenti</h4>
              <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-striped table-hover table-sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID Utente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((id, index) => (
                      <tr key={id}>
                        <td>{indexOfFirstUser + index + 1}</td>
                        <td>{id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginazione */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <i className="bi bi-arrow-left"></i> Precedente
              </button>

              <span className="text-muted">
                Pagina {currentPage} di {totalPages}
              </span>

              <button
                className="btn btn-outline-secondary"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Successiva <i className="bi bi-arrow-right"></i>
              </button>
            </div>
              <p className="text-muted text-end mt-2">Totale utenti: {userList.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

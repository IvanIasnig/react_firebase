import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./components/auth";
import { db } from "./config/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";

function App() {
  const [movieList, setMovieList] = useState([]);

  //New movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newRealaseDate, setNewRealaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovieList(filteredData);
      } catch (err) {
        console.log(err);
      }
    };

    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        realasedate: newRealaseDate,
        recivedAnOscar: isNewMovieOscar,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <Auth />
      <div>
        <input
          placeholder="Movie titles..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Realase date..."
          type="number"
          onChange={(e) => setNewRealaseDate(e.target.value)}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />{" "}
        <label>Recived an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.recivedAnOscar ? "gold" : "red" }}>
              {movie.title}
            </h1>
            <p> Date : {movie.realasedate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

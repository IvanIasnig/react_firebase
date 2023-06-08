import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function App() {
  // User State
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const [movieList, setMovieList] = useState([]);

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // Update Title State
  const [updatedTitle, setUpdatedTitle] = useState("");

  // File Upload State
  const [fileUpload, setFileUpload] = useState(null);

  // Download URL state
  const [downloadURL, setDownloadURL] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      // Ensure that the user is logged in
      if (user) {
        // Create a query against the collection.
        const q = query(moviesCollectionRef, where("userId", "==", user.uid));

        const data = await getDocs(q);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovieList(filteredData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, [user]);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);

      // After the file uploads, get a download URL
      const url = await getDownloadURL(filesFolderRef);

      // Save the download URL to state
      setDownloadURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="navbar-brand">Movie App</div>
      </nav>

      <div className="container">
        <Auth />

        <div className="card mb-4 p-4">
          <div className="form-group">
            <input
              className="form-control mb-2"
              placeholder="Movie title..."
              onChange={(e) => setNewMovieTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Release Date..."
              type="number"
              onChange={(e) => setNewReleaseDate(Number(e.target.value))}
            />
          </div>
          <div className="form-group form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isNewMovieOscar}
              onChange={(e) => setIsNewMovieOscar(e.target.checked)}
            />
            <label className="form-check-label">Received an Oscar</label>
          </div>
          <button className="btn btn-primary" onClick={onSubmitMovie}>
            Submit Movie
          </button>
        </div>

        <div className="card mb-4 p-4">
          {movieList.map((movie) => (
            <div key={movie.id} className="mb-3">
              <h2 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
                {movie.title}
              </h2>
              <p> Date: {movie.releaseDate} </p>

              <button
                className="btn btn-danger m-2"
                onClick={() => deleteMovie(movie.id)}
              >
                Delete Movie
              </button>

              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="new title..."
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
              </div>
              <button
                className="btn btn-success m-1"
                onClick={() => updateMovieTitle(movie.id)}
              >
                Update Title
              </button>
            </div>
          ))}
        </div>

        <div className="card p-4">
          <div className="form-group">
            <input
              type="file"
              className="form-control-file"
              onChange={(e) => setFileUpload(e.target.files[0])}
            />
          </div>
          <button className="btn btn-info" onClick={uploadFile}>
            Upload File
          </button>
          {downloadURL && (
            <a href={downloadURL} download>
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

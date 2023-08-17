import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MovieList from './components/movie-list/movie-list';
import MovieDetail from './components/movie-detail/movie-detail';

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/movies" replace={true} />}  >
          </Route>
          <Route path="movies" element={<MovieList />} />
          <Route path="movies/:id/movie-detail" element={<MovieDetail />} />
          <Route path="*" element={<Navigate to="/movies" replace={true} />} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;

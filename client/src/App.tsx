import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import Video from './pages/Video';

library.add(fas);

const App = () => {
    return (
        <Router key="router">
            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/:id" element={<Video />} />

                <Route path="*" element={<span>Not found</span>} />
            </Routes>
        </Router>
    );
};

export default App;

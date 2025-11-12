import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import './singleComicPage.scss';

const SingleComicPage = () => {
    const { comicId } = useParams();
    const [comic, setComic] = useState(null);

    const { loading, error, getComics, clearError } = useMarvelService();

    // ✅ useEffect вызывается только при изменении comicId
    useEffect(() => {
        if (!comicId) return;

        clearError();
        getComics(comicId)
            .then((data) => {
                setComic(data);
                console.log("✅ Comic loaded:", data);
            })
            .catch((err) => console.error("❌ Comic load error:", err));
    }, [comicId, getComics, clearError]);

    // 🔄 Отображение состояний
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage />;
    if (!comic) return null;

    return <View comic={comic} />;
};

const View = ({ comic }) => {
    const { title, description, pageCount, thumbnail, price, language } = comic;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__title">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">
                Back to all
            </Link>
        </div>
    );
};

// ✅ Проверка типов
View.propTypes = {
    comic: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        pageCount: PropTypes.string,
        thumbnail: PropTypes.string,
        price: PropTypes.string,
        language: PropTypes.string,
    }).isRequired,
};

export default SingleComicPage;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRequest = (offset, initial) => {
        if (!initial) setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded)
            .catch(() => setNewItemLoading(false));
    };

    const onComicsLoaded = (newComics) => {
        const ended = newComics.length < 8;

        setComics(prev => [...prev, ...newComics]);
        setNewItemLoading(false);
        setOffset(prev => prev + 8);
        setComicsEnded(ended);
    };

    const renderItems = (arr) => (
        <ul className="comics__grid">
            {arr.map((item) => (
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`} href={item.homepage}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            ))}
        </ul>
    );

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const items = renderItems(comics);

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            {!comicsEnded && (
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            )}
        </div>
    );
};

export default ComicsList;
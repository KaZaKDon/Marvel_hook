import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import abyss from '../../resources/img/abyss.jpg';
//import { charShape } from '../../utils/charShape';

const CharList = ({ onCharSelected = () => {} }) => {
    const [chars, setChars] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const itemsRefs = useRef([]);
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRequest = (currentOffset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(currentOffset)
            .then(onCharsLoaded)
    };

    const onCharsLoaded = (newChars) => {
        const ended = newChars.length < 9;

        setChars((chars) => [...chars, ...newChars]);
        setNewItemLoading(false);
        setOffset((offset) => offset + 9);
        setCharEnded(ended);
    };

    const focusOnItem = (i) => {
        itemsRefs.current.forEach((item) => item?.classList.remove('char__item_selected'));
        if (itemsRefs.current[i]) {
            itemsRefs.current[i].classList.add('char__item_selected');
            itemsRefs.current[i].focus();
        }
    };

    const renderItems = (arr) => {
        return (
            <ul className="char__grid">
                {arr.map((item, i) => {
                    const imgStyle = item.imageAvailable ? { objectFit: 'cover' } : { objectFit: 'contain' };

                    return (
                        <li
                            key={item.id}
                            className="char__item"
                            tabIndex={0}
                            ref={(el) => (itemsRefs.current[i] = el)}
                            onClick={() => {
                                onCharSelected(item.id);
                                focusOnItem(i);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    onCharSelected(item.id);
                                    focusOnItem(i);
                                }
                            }}
                        >
                            <img src={item.thumbnail || abyss} alt={item.name} style={imgStyle} />
                            <div className="char__name">{item.name}</div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const errorMessage = error ? <ErrorMessage /> : null
    const spiner = loading && !newItemLoading ? <Spinner /> : null;
    const content = renderItems(chars);

    return (
        <div className="char__list">
            {errorMessage}
            {spiner}
            {content}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ display: charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

CharList.propTypes = {
    onCharSelected: PropTypes.func,
};

export default CharList;
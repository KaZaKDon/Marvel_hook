import PropTypes from 'prop-types';

export const charShape = PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    homepage: PropTypes.string,
    wiki: PropTypes.string,
    comics: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string
        })
    ),
    imageAvailable: PropTypes.bool
});
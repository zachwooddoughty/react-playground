import React, { Component, PropTypes } from 'react';
import useSheet from 'react-jss';

const SVG = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   width="64px" height="64px" viewBox="0 0 499.31 499.311" style=""
   xml:space="preserve">
<g>
  <path d="M486.632,214.451c-29.29,10.002-58.714,19.383-88.128,28.812c-0.479-72.464-25.351-145.771-37.408-145.771
    c-22.683,0-34.894,88.559-34.894,88.559c-75.028-61.152-155.296,0-155.296,0c-5.24-10.538-29.663-75.907-50.604-75.907
    s-19.192,86.455-19.192,86.455c-0.21,21.946,0.889,41.616,3.184,59.306c-31.518-1.711-63.017-3.662-94.458-6.837
    c-13.167-1.329-13.062,23.428,0,24.748c32.895,3.327,65.848,5.316,98.81,7.086c1.473,6.617,3.165,12.88,5.059,18.818
    c-32.848,6.474-65.762,12.173-98.762,17.395c-12.9,2.037-13.062,26.813,0,24.748c36.146-5.719,72.226-11.867,108.19-19.059
    c2.974,6.024,6.56,11.063,10.108,16.189c-27.76,14.86-56.094,27.674-85.173,38.364c-12.594,4.639-7.22,28.525,5.441,23.859
    c32.732-12.04,64.604-26.565,95.721-43.711c37.466,34.636,95.156,38.403,168.252,24.633c22.147-4.169,38.565-14.889,50.768-29.605
    c31.681,16.381,63.926,30.39,97.91,38.365c12.9,3.031,18.398-20.817,5.441-23.858c-31.308-7.354-61.152-19.747-90.413-34.588
    c3.088-6.234,5.833-12.756,8.013-19.68c32.159,4.007,64.471,5.441,96.744,8.453c13.177,1.234,13.081-23.523,0-24.747
    c-30.284-2.831-60.665-3.979-90.872-7.564c1.1-6.445,1.922-13.033,2.477-19.708c31.547-10.146,63.112-20.187,94.534-30.916
    C504.763,233.978,499.37,210.1,486.632,214.451z"/>
`;

const STYLES = {
  kitten: {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '33%',
    padding: '0.5rem',
    boxSizing: 'border-box'
  },
  button: {
    padding: '1rem 1.5rem',
    background: '#FFAAAA',
    '&:hover': {
      background: '#FFBBBB'
    },
    border: 0,
    borderRadius: '0.5rem',
    cursor: 'pointer',
    textAlign: 'center',
    userSelect: 'none'
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

const COLORS = ['#FFAAAA', '#FFAAFF', '#AAAAFF', '#FFFFAA', '#339933', '#333399', '#993399', '#339999'];

@useSheet(STYLES)
export default class Kitten extends Component {
  static propTypes = {
    kitten: PropTypes.shape({
      id: PropTypes.number.isRequired,
      created: PropTypes.string.isRequired
    }).isRequired
  }

  static contextTypes = {
    flux: PropTypes.object
  }

  render() {
    const { sheet: { classes } } = this.props;
    const style = { color: COLORS[this.props.kitten.id % 8], fill: 'currentColor' };

    return (
      <div className={classes.kitten}>
        <div className={classes.info}><div dangerouslySetInnerHTML={{__html: SVG}} style={style}/> <span>Kitten #{this.props.kitten.id}</span></div>
        <a className={classes.button} onClick={this.handleDeleteClick.bind(this)}>Remove kitten</a>
      </div>
    );
  }

  handleDeleteClick() {
    const { flux } = this.context;

    flux.getActions('kittens').deleteKitten(this.props.kitten.id);
  }
}

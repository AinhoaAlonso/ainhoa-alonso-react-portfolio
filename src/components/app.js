import React, { Component } from 'react';
import moment from "moment";

import PortfolioContanier from './portfolio/portfolio-container';
import PortfolioItem from './portfolio/portfolio-item';

export default class App extends Component {
  
  render() {
    return (
      <div className='app'>
        <h1>Ainhoa Alonso Portfolio</h1>
        <div>{moment().format('MMMM Do YYYY, h:mm:ss a')}</div>
        <PortfolioContanier /> {/*Asi llamamos al componente creado*/}
      </div>
    );
  }
}

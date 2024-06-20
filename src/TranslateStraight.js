import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import styles from './styles/index.module.css'; 

function TranslateStraight(){
  useEffect(() => {
      const clearLocalStorage = () => {
        localStorage.clear();
        console.log('Local storage cleared');
      }  
      
      clearLocalStorage();
  }, []);


  return (
    <div className={styles.seventy}>
      <div id={styles.skip}>
        <Link to="/Translate"><h1 id="translate">Translate Now</h1></Link>
      </div>
    </div>
  );
}


  export default TranslateStraight;
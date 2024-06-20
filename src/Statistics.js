import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './styles/teamP.css'; 
import styles from './styles/statistics.module.css'; 

function Statistics(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [aiData, setaiData] = useState(false);
    const [userId, setUserId] = useState("");
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }
            if (userId !== undefined && userId !== null  && userId) {
                console.log(userId)
                setIsLoggedIn(true);
            }
            
            const fetchData = async (userId) => {
                try {
                    const response = await axios.post('http://localhost:5000/populate', { userId }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if(!response.data || response.data.length == 0){
                        setaiData(false);
                        console.log("User has no data")
                    }else{
                        setaiData(true);
                        setTableData(response.data);
                        console.log(response.data)
                    }
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            };
        
            if (userId) {
                fetchData(userId); // Fetch data only if userId is valid
            }else{
                console.log(isLoggedIn);
                setLoading(false);
            }
    }, [userId]);

    const handleDownload = ((key, item) => {
        console.log(key, item)
        axios.post('http://localhost:5000/download', { key, item, userId })
        .then(response => {
            console.log(response);
            console.log(response.config);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            if(item == 'none'){
                saveAs(blob, key);
            }else{
                saveAs(blob, item + key)
            }
            
        })
        .catch(error => {
            console.error('Error downloading file:', error);
        });
	}); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return(
      <div>
        <header>
        <svg className="drip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
                fill="#36845c"
                fillOpacity="1"
                d="M0,96L48,128C96,160,192,224,288,224C384,224,480,160,576,138.7C672,117,768,139,864,165.3C960,192,1056,224,1152,234.7C1248,245,1344,235,1392,229.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
                <div className='row header'>
                <div className={`${'fifty'} ${styles.fifty}`}>  
					<Link to="/Translate"><h1 className={`${'unactive'} ${styles.unactive}`}>TRANSLATE</h1></Link>   
                </div>
                <div className={`${'fifty'} ${styles.fifty}`}>
                    <Link to="/Statistics"><h1 className={`${'active'} ${styles.active}`}>STATISTICS</h1></Link>
                </div>
            </div>
            <div id='logo'>
                <Link to="/"><img src="/assets/logoc.png" alt="Logo" /></Link>
            </div>
        </header>

        <div className={`${'content'} ${styles.content}`}>
        {isLoggedIn ? (
            aiData ?(
                <div>
                    <h2>Translate History</h2>
                    <p>Click on the file name or available languages to download your files!</p>
                    <br/>
                    <br/>
                    <table>
                        <tbody>
                            <tr>
                                <th id={styles.fcolumn}>Available Files</th>
                                <th id={styles.lcolumn}>Translated Languages</th>
                            </tr>
                            {tableData.map((row, index) => (
                                <React.Fragment key={index}>
                                <tr>
                                    <td onClick={() => handleDownload(row.Key, 'none')} className={styles.transFile}>{row.Key}</td>
                                    <td className={styles.transDownload}>
                                        {row.Item.split(',').map((item, itemIndex) => (
                                            <div className={styles.transLanguages} key={itemIndex} onClick={() => handleDownload(row.Key, item)}>{item}</div>
                                        ))}
                                    </td>
                                </tr>
                                {/* Add a separator row if not the last row */}
                                {index !== tableData.length - 1 && (
                                    <tr key={`${index}-separator`}>
                                        <td colSpan="2" className={styles.filler}></td>
                                    </tr>
                                )}
                            </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>    
                ) :(
                    <p>It looks like you have no data yet. Start translating to save your data!</p>
                )
            ) : (
                <p>Please sign in to view saved files</p>
            )}    
        </div>
    </div>   
    );
  }

  export default Statistics;
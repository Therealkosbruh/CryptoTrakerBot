import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './table.module.css';

interface Crypto {
  id: number;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  updatedAt: string;
}

interface CryptoListProps {
  searchQuery: string; 
}

const CryptoList: React.FC<CryptoListProps> = ({ searchQuery }) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]); 
  const [displayedCryptos, setDisplayedCryptos] = useState<Crypto[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [page, setPage] = useState<number>(1); 
  const [pageSize] = useState<number>(10); 

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cryptos'); 
        setCryptos(response.data); 
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить данные');
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []); 

  useEffect(() => {
    const filteredCryptos = cryptos.filter(
      (crypto) =>
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startIndex = (page - 1) * pageSize;
    const newCryptos = filteredCryptos.slice(startIndex, startIndex + pageSize);
    setDisplayedCryptos(newCryptos); 
  }, [page, cryptos, searchQuery]); 

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1); 
  };

  const goBack = () => {
    setPage((prevPage) => prevPage - 1); 
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Символ</th>
            <th>Имя</th>
            <th>Цена</th>
            <th>Подписка</th>
          </tr>
        </thead>
        <tbody>
          {displayedCryptos.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.symbol}</td>
              <td>{crypto.name}</td>
              <td>${crypto.price.toLocaleString()}</td>
              <td>Free</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.paginationButtonsContainer}>
        {page > 1 && (
          <button className={styles.paginationButton} onClick={goBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ transform: 'rotate(180deg)', fill: 'silver' }} 
            >
              <path d="m18.707 12.707-1.414-1.414L13 15.586V6h-2v9.586l-4.293-4.293-1.414 1.414L12 19.414z"></path>
            </svg>
          </button>
        )}
        <button className={styles.paginationButton} onClick={loadMore}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'silver' }}>
            <path d="m18.707 12.707-1.414-1.414L13 15.586V6h-2v9.586l-4.293-4.293-1.414 1.414L12 19.414z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CryptoList;

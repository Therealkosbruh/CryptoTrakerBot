import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './table.module.css';

interface Crypto {
  id: number;
  symbol: string;
  name: string;
  price: number;
}

interface CryptoListProps {
  searchQuery: string;
  sortOrder: string | null;
  subscriptions: number[];
}

const CryptoList: React.FC<CryptoListProps> = ({ searchQuery, sortOrder, subscriptions }) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [displayedCryptos, setDisplayedCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [userSubscriptions, setUserSubscriptions] = useState<number[]>(subscriptions);

  useEffect(() => {
    setUserSubscriptions(subscriptions);
  }, [subscriptions]);

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
    let filteredCryptos = cryptos.filter(
      (crypto) =>
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === 'asc') {
      filteredCryptos.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filteredCryptos.sort((a, b) => b.price - a.price);
    }

    const startIndex = (page - 1) * pageSize;
    const newCryptos = filteredCryptos.slice(0, startIndex + pageSize);
    setDisplayedCryptos(newCryptos);
  }, [cryptos, searchQuery, sortOrder, page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const goBack = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleSubscriptionClick = async (cryptoId: number) => {
    try {
      const userId = '1327778297';
      const isSubscribed = userSubscriptions.includes(cryptoId);

      if (isSubscribed) {
        await axios.post('http://localhost:5000/unsubscribe', { userId, cryptoId });
        setUserSubscriptions((prev) => prev.filter((id) => id !== cryptoId));
      } else {
        await axios.post('http://localhost:5000/subscribe', { userId, cryptoId });
        setUserSubscriptions((prev) => [...prev, cryptoId]);
      }
    } catch (error) {
      console.error('Ошибка при изменении подписки:', error);
    }
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
              <td>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{
                    fill: userSubscriptions.includes(crypto.id) ? 'red' : 'gray',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSubscriptionClick(crypto.id)}
                >
                  <path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path>
                </svg>
              </td>
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

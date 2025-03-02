import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import styles from './cryptopage.module.css';
import SearchBar from '../components/SearchBar/SearchBar';
import CryptoList from '../components/Table/CryptoList';
import FilterComponent from '../components/Filter/FilterComponent';
import axios from 'axios';

const CryptoPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<number[]>([]); 

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const userId = '1327778297'; 
        const response = await axios.get(`http://localhost:5000/subscriptions/${userId}`);
        const subscribedCryptoIds = response.data.map((crypto: any) => crypto.id);
        setSubscriptions(subscribedCryptoIds);
      } catch (error) {
        console.error('Ошибка при получении подписок:', error);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    localStorage.setItem('searchQuery', query);
  };

  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleFilterChange = (option: string) => {
    if (option === 'option1') {
      setSortOrder('asc');
    } else if (option === 'option2') {
      setSortOrder('desc');
    } else {
      setSortOrder(null);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h1 className={styles.pageTitle}>Список валют</h1>
        <div className={styles.searchWrapper}>
          <div className={styles.searchContainer}>
            <SearchBar onSearch={handleSearch} />
            <span className={styles.icon} onClick={toggleFilter}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M21 3H5a1 1 0 0 0-1 1v2.59c0 .523.213 1.037.583 1.407L10 13.414V21a1.001.001 0 0 0 1.447.895l4-2c.339-.17.553-.516.553-.895v-5.586l5.417-5.417c.37-.37.583-.884.583-1.407V4a1 1 0 0 0-1-1zm-6.707 9.293A.996.996 0 0 0 14 13v5.382l-2 1V13a.996.996 0 0 0-.293-.707L6 6.59V5h14.001l.002 1.583-5.71 5.71z"></path>
              </svg>
            </span>
          </div>
        </div>
        {isFilterVisible && <FilterComponent onFilterChange={handleFilterChange} />}
      </main>
      <CryptoList
        searchQuery={searchQuery}
        sortOrder={sortOrder}
        subscriptions={subscriptions} 
      />
    </div>
  );
};

export default CryptoPage;

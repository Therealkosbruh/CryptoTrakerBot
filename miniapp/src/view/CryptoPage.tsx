import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header'; 
import styles from './cryptopage.module.css';
import SearchBar from '../components/SearchBar/SearchBar';
import CryptoList from '../components/Table/CryptoList';

const CryptoPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); 

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

  return (
    <div>
      <Header />
      <main>
        <h1 className={styles.pageTitle}>Список валют</h1>
        <SearchBar onSearch={handleSearch} /> 
      </main>
      <CryptoList searchQuery={searchQuery} /> 
    </div>
  );
};

export default CryptoPage;

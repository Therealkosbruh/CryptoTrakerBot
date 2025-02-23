import React from 'react';
import styles from './header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <a href="#" className={styles.profile}>
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx5H3czTHdNck8h89PWryXrFzqpIJkS3PDmMIp2bpT66t-2HtmKVTMpxkr8ABLPkgcUyy6qX8RItPR4x74iMN7Qg" 
          alt="Avatar" 
          className={styles.avatar} 
        />
        <div className={styles.stylesInfo}>
          <div className={styles.nickname}>Nickname</div>
        </div>
      </a>
    </header>
  );
};
export default Header;

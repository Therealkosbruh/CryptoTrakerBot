import React, { useState } from "react";
import styles from "./filter.module.css";

interface FilterComponentProps {
  onFilterChange: (option: string) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilterChange }) => {
  const [selected, setSelected] = useState<string>("");

  const handleChange = (option: string) => {
    setSelected(option);
    onFilterChange(option);
  };

  return (
    <div className={styles.filterContainer}>
      {[
        { id: "option1", icon: "M3 3v17a1 1 0 0 0 1 1h17v-2H5V3H3z M15.293 14.707a.999.999 0 0 0 1.414 0l5-5-1.414-1.414L16 12.586l-2.293-2.293a.999.999 0 0 0-1.414 0l-5 5 1.414 1.414L13 12.414l2.293 2.293z" },
        { id: "option2", icon: "M5 3H3v18h18v-2H5z M13 12.586 8.707 8.293 7.293 9.707 13 15.414l3-3 4.293 4.293 1.414-1.414L16 9.586z" },
        { id: "option3", icon: "M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z" },
      ].map((option) => (
        <label key={option.id} className={styles.radioLabel}>
          <input
            type="radio"
            name="filter"
            value={option.id}
            checked={selected === option.id}
            onChange={() => handleChange(option.id)}
            className={styles.radioInput}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d={option.icon}></path>
          </svg>
        </label>
      ))}
    </div>
  );
};

export default FilterComponent;

// ./components/Note.js
import React from 'react';

function Note ({ title, content }) {
  const styles = {
    card: {
      position: 'relative',
      border: '1px solid #ddd',
      padding: '20px',
      margin: '10px',
      borderRadius: '5px',
      backgroundColor: '#fff',
      
      width: 'calc(50% - 20px)', // Adjust width for responsiveness
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    cardContent: {
      fontSize: '16px',
    },
    cardHover:{
        transform: 'translateY(-10px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      },
    hole: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      width: '30px',
      height: '30px',
      backgroundColor: '#f4f4f4',
      borderRadius: '50%',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.hole}></div>
      <h2 style={styles.cardTitle}>{title}</h2>
      <p style={styles.cardContent}>{content}</p>
    </div>
  );
}

export default Note;

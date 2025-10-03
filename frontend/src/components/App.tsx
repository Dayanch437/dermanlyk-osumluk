import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import HomePage from './HomePage';
import WordDetailPage from './WordDetailPage';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2d5016',
          borderRadius: 6,
          fontFamily: 'serif',
        },
      }}
    >
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/word/:wordId" element={<WordDetailPage />} />
          <Route path="/osumlik/:wordId" element={<WordDetailPage />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
};

export default App;
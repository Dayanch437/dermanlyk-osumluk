import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Button,
  Card,
  List,
  Typography,
  Space,
  Spin,
  Empty,
  Row,
  Col,
  AutoComplete,
  Divider,
  Avatar,
  Carousel,
} from 'antd';
import api, { wordService } from '../services/api';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  HeartOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  ReloadOutlined,
  RollbackOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Osumlik {
  id: string | number;
  name: string;
  name_latin?: string;
  character: string;
  living_specification: string;
  natural_source: string;
  usage: string;
  chemical_composition: string;
  raw_material_for_medicine: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  photo?: string;  // Local file path
  photo_url?: string;  // Full URL to photo
  
  // Legacy fields for compatibility with existing UI
  ady?: string;
  hasiyeti?: string;
  yasayys_ayratynlygy?: string;
  yayraway?: string;
  tegigy?: string;
  gory?: string;
  cig_maly?: string;
  himiki_duzumi?: string;
  peydaly_nys?: string;
  suraty?: string;
  kategoriýa?: string;
}

const HomePage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Osumlik[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{value: string | number, label: string}[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [herbs, setHerbs] = useState<Osumlik[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const pageSize = 50; // Show 50 items per page
  const navigate = useNavigate();

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to fetch herbs data
  const fetchHerbs = async () => {
    try {
      setLoading(true);
      
      // Use a direct API call to the main endpoint for listing all herbs
      const response = await api.get(`/words/?page=${currentPage}&limit=${pageSize}`);
      console.log('Direct API Response:', response.data);
      
      // Map API response to local structure
      const apiHerbs = response.data.results.map((herb: any) => {
        const mappedHerb = {
          id: herb.id,
          name: herb.name,
          name_latin: herb.name_latin || '',
          character: herb.character || '',
          living_specification: herb.living_specification || '',
          natural_source: herb.natural_source || '',
          usage: herb.usage || '',
          chemical_composition: herb.chemical_composition || '',
          raw_material_for_medicine: herb.raw_material_for_medicine || '',
          created_at: herb.created_at,
          updated_at: herb.updated_at,
          is_deleted: herb.is_deleted,
          deleted_at: herb.deleted_at,
          photo: herb.photo || null,
          photo_url: herb.photo_url || null,
          
          // Legacy mappings for UI compatibility
          ady: herb.name,
          hasiyeti: herb.character || 'Mälim däl',
          yasayys_ayratynlygy: herb.living_specification || 'Mälim däl',
          yayraway: herb.natural_source || 'Mälim däl',
          tegigy: 'Plant Family',
          gory: 'Plant Genus',
          cig_maly: herb.raw_material_for_medicine || 'Mälim däl',
          himiki_duzumi: herb.chemical_composition || 'Mälim däl',
          peydaly_nys: herb.usage || 'Mälim däl',
          suraty: '🌿', // Default plant emoji
          kategoriýa: 'Tükmenistanyň Derman ösümligi'
        };
        return mappedHerb;
      });
      
      setHerbs(apiHerbs);
      setTotalItems(response.data.count || apiHerbs.length);
      setShowRecommendations(true); // Make sure to show the herb list
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching herbs:', error);
      setLoading(false);
      // Fallback to empty array
      setHerbs([]);
    }
  };
  
  // Fetch data from API when component mounts
  useEffect(() => {
    fetchHerbs();
  }, [currentPage, pageSize]);

  // Data for the application comes from API via useEffect hook above

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setSuggestions([]);
      setShowRecommendations(true);
      return;
    }

    // Generate suggestions with plant IDs for direct navigation
    const filteredSuggestions = herbs
      .filter(osumlik => 
        (osumlik.ady?.toLowerCase().includes(value.toLowerCase()) || false) ||
        (osumlik.kategoriýa?.toLowerCase().includes(value.toLowerCase()) || false)
      )
      .slice(0, 5)
      .map(osumlik => ({
        value: osumlik.id, // Use ID instead of name for direct navigation
        label: `🌿 ${osumlik.ady || osumlik.name} - Derman Ösümligi`
      }));
      
    setSuggestions(filteredSuggestions);
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      setSearchTerm('');
      setShowRecommendations(true);
      return;
    }

    setLoading(true);
    setSearchTerm(value);
    setShowRecommendations(false);

    try {
      // Use the API service to search - get more results for name-only searching
      const response = await wordService.searchWords(value, {}, 1, 100);
      
      // Map API response to local structure
      const apiResults = response.results.map((herb: any) => ({
        id: herb.id,
        name: herb.name,
        character: herb.character || '',
        living_specification: herb.living_specification || '',
        natural_source: herb.natural_source || '',
        usage: herb.usage || '',
        chemical_composition: herb.chemical_composition || '',
        raw_material_for_medicine: herb.raw_material_for_medicine || '',
        created_at: herb.created_at,
        updated_at: herb.updated_at,
        is_deleted: herb.is_deleted,
        deleted_at: herb.deleted_at,
        photo: herb.photo || null,
        photo_url: herb.photo_url || null,
        
        // Legacy mappings for UI compatibility
        ady: herb.name,
        hasiyeti: herb.character || 'Mälim däl',
        yasayys_ayratynlygy: herb.living_specification || 'Mälim däl',
        yayraway: herb.natural_source || 'Mälim däl',
        tegigy: 'Plant Family',
        gory: 'Plant Genus',
        cig_maly: herb.raw_material_for_medicine || 'Mälim däl',
        himiki_duzumi: herb.chemical_composition || 'Mälim däl',
        peydaly_nys: herb.usage || 'Mälim däl',
        suraty: '🌿',
        kategoriýa: 'Derman ösümligi'
      }));
      
      // Sort results by relevance - exact name matches first
      const sortedResults = apiResults.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase() === value.toLowerCase();
        const bNameMatch = b.name.toLowerCase() === value.toLowerCase();
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        const aStartsWithMatch = a.name.toLowerCase().startsWith(value.toLowerCase());
        const bStartsWithMatch = b.name.toLowerCase().startsWith(value.toLowerCase());
        
        if (aStartsWithMatch && !bStartsWithMatch) return -1;
        if (!aStartsWithMatch && bStartsWithMatch) return 1;
        
        return 0;
      });
      
      setSearchResults(sortedResults);
      setLoading(false);
    } catch (error) {
      console.error('Error searching herbs:', error);
      setLoading(false);
      setSearchResults([]);
    }
  };

  // Debounced search for real-time results
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          // Use herbs state for local filtering to avoid excessive API calls
          const filteredResults = herbs.filter((herb: Osumlik) => 
            (herb.ady?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (herb.hasiyeti?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (herb.kategoriýa?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (herb.yayraway?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (herb.peydaly_nys?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
          );
          
          // If we have local results, use them for immediate feedback
          if (filteredResults.length > 0) {
            setSearchResults(filteredResults);
          } else {
            // Otherwise, make an API call for more comprehensive search
            const response = await wordService.searchWords(searchTerm, {}, 1, 20);
            const apiResults = response.results.map((herb: any) => ({
              id: herb.id,
              name: herb.name,
              character: herb.character || '',
              living_specification: herb.living_specification || '',
              natural_source: herb.natural_source || '',
              usage: herb.usage || '',
              chemical_composition: herb.chemical_composition || '',
              raw_material_for_medicine: herb.raw_material_for_medicine || '',
              created_at: herb.created_at,
              updated_at: herb.updated_at,
              is_deleted: herb.is_deleted,
              deleted_at: herb.deleted_at,
              photo: herb.photo || null,
              photo_url: herb.photo_url || null,
              
              // Legacy mappings for UI compatibility
              ady: herb.name,
              hasiyeti: herb.character || 'Mälim däl',
              yasayys_ayratynlygy: herb.living_specification || 'Mälim däl',
              yayraway: herb.natural_source || 'Mälim däl',
              tegigy: 'Plant Family',
              gory: 'Plant Genus',
              cig_maly: herb.raw_material_for_medicine || 'Mälim däl',
              himiki_duzumi: herb.chemical_composition || 'Mälim däl',
              peydaly_nys: herb.usage || 'Mälim däl',
              suraty: '🌿',
              kategoriýa: 'Derman ösümligi'
            }));
            setSearchResults(apiResults);
          }
        } catch (error) {
          console.error('Error in debounced search:', error);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, herbs]);

  const handleItemClick = (osumlik: Osumlik) => {
    navigate(`/osumlik/${osumlik.id}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8faf9' }}>
      {/* Modern Professional Header */}
      <Header style={{ 
        background: '#ffffff',
        padding: '0 50px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid #e8e8e8'
      }}>
        <Row justify="space-between" align="middle" style={{ height: '64px' }}>
          <Col xs={24} sm={12} md={10}>
            <Space align="center" size="middle">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)'
              }}>
                <MedicineBoxOutlined style={{ fontSize: '22px', color: 'white' }} />
              </div>
              <div>
                <Title level={4} style={{ 
                  margin: 0,
                  fontSize: isMobile ? '16px' : '20px',
                  fontWeight: 600,
                  color: '#2c5530',
                  letterSpacing: '-0.5px'
                }}>
                 Türkmenistanyň Dermanlyk Ösümlikleri
                </Title>
                <Text type="secondary" style={{ fontSize: '12px', display: isMobile ? 'none' : 'block' }}>
                  Türkmenistan tebigy hasabaty
                </Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Header>
      
      <Content style={{ padding: '0', background: '#f8faf9' }}>
        {/* Hero Slider Section */}
        <div style={{ 
          background: '#ffffff',
          marginBottom: '0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          padding: isMobile ? '20px 15px' : '40px 50px'
        }}>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              <Carousel 
                autoplay 
                autoplaySpeed={5000} 
                effect="fade"
                dots={{ className: 'custom-carousel-dots' }}
              >
                <div>
                  <div style={{
                    height: isMobile ? '200px' : '300px',
                    background: 'url("/kniga.jpg") center/contain no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    width: '100%'
                  }} />
                </div>
              </Carousel>
            </Col>
          </Row>
        </div>

        {/* Modern Search Section */}
        <div style={{ 
          padding: isMobile ? '40px 20px' : '60px 50px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8faf9 100%)',
        }}>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Title level={2} style={{ 
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                  fontWeight: 700,
                  color: '#2c5530',
                  marginBottom: '16px'
                }}>
                 Türkmenistanyň Dermanlyk Ösümliklerini Gözläň
                </Title>
                <Paragraph style={{ 
                  fontSize: '16px',
                  color: '#666',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  {totalItems} sany dermanlyk ösümliginiň içinden gözleýäň
                </Paragraph>
              </div>
              
              <Card 
                bordered={false}
                style={{ 
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  background: '#ffffff'
                }}
                bodyStyle={{ padding: isMobile ? '24px' : '32px' }}
              >
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={17} md={18} lg={19}>
                    <AutoComplete
                      style={{ width: '100%' }}
                      size="large"
                      value={searchTerm}
                      options={suggestions}
                      onSearch={handleInputChange}
                      onSelect={(value) => {
                        navigate(`/osumlik/${value}`);
                      }}
                      placeholder="Ösümliginiň adyny giriziň..."
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={7} md={6} lg={5}>
                    <Button 
                      type="primary" 
                      icon={<SearchOutlined />}
                      loading={loading}
                      onClick={() => handleSearch(searchTerm)}
                      size="large"
                      block
                      style={{
                        background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '16px',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      GÖZLE
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Content Section */}
        <div style={{ 
          padding: isMobile ? '20px 15px 50px' : '40px 50px 80px',
          background: '#f8faf9'
        }}>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              
              {/* Search Results Section */}
              {!loading && searchResults.length > 0 && (
                <Card 
                  bordered={false}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    marginBottom: '40px',
                    overflow: 'hidden'
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  <div style={{ 
                    background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                    padding: '24px 32px',
                    color: 'white'
                  }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space>
                          <SearchOutlined style={{ fontSize: '24px' }} />
                          <div>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              Gözleg Netijeleri
                            </Title>
                            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                              {searchResults.length} sany netije tapyldy
                            </Text>
                          </div>
                        </Space>
                      </Col>
                      <Col>
                        <Button 
                          onClick={() => {
                            setSearchResults([]);
                            setSearchTerm('');
                            setShowRecommendations(true);
                          }}
                          icon={<RollbackOutlined />}
                          style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white'
                          }}
                        >
                          Yza
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={searchResults}
                      renderItem={(osumlik) => (
                        <List.Item 
                          onClick={() => handleItemClick(osumlik)}
                          style={{ 
                            cursor: 'pointer',
                            padding: '16px 20px',
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'all 0.3s ease',
                            background: '#ffffff'
                          }}
                          className="herb-list-item-hover"
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar 
                                size={48} 
                                style={{ 
                                  background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                                  fontSize: '20px',
                                  fontWeight: 600
                                }}
                              >
                                {osumlik.ady?.charAt(0) || osumlik.name?.charAt(0)}
                              </Avatar>
                            }
                            title={
                              <Text strong style={{ fontSize: '16px', color: '#2c5530' }}>
                                {osumlik.ady || osumlik.name}
                              </Text>
                            }
                            description={
                              osumlik.character && (
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                  {osumlik.character}
                                </Text>
                              )
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              )}
              
              {/* Herb List - All Herbs */}
              {showRecommendations && !loading && herbs.length > 0 && (
                <Card 
                  bordered={false}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    marginBottom: '40px',
                    overflow: 'hidden'
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  <div style={{ 
                    background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                    padding: '24px 32px',
                    color: 'white'
                  }}>
                    <Space>
                      <MedicineBoxOutlined style={{ fontSize: '24px' }} />
                      <div>
                        <Title level={4} style={{ color: 'white', margin: 0 }}>
                          Türkmenistanyň Dermanlyk Ösümlikleri
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                          Türkmenistanyň tebigy hasabaty
                        </Text>
                      </div>
                    </Space>
                  </div>
                  
                  <div style={{ padding: '24px' }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={herbs}
                      renderItem={(herb) => (
                        <List.Item 
                          onClick={() => handleItemClick(herb)}
                          style={{ 
                            cursor: 'pointer',
                            padding: '16px 20px',
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'all 0.3s ease',
                            background: '#ffffff'
                          }}
                          className="herb-list-item-hover"
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar 
                                size={48} 
                                style={{ 
                                  background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                                  fontSize: '20px',
                                  fontWeight: 600
                                }}
                              >
                                {herb.ady?.charAt(0) || herb.name?.charAt(0)}
                              </Avatar>
                            }
                            title={
                              <Text strong style={{ fontSize: '16px', color: '#2c5530' }}>
                                {herb.ady || herb.name}
                              </Text>
                            }
                            description={
                              herb.character && (
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                  {herb.character}
                                </Text>
                              )
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                  
                  {/* Modern Pagination */}
                  <div style={{ 
                    padding: '24px 32px',
                    background: '#fafafa',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text type="secondary">
                          Sahypa {currentPage} / {Math.ceil(totalItems / pageSize)}
                        </Text>
                      </Col>
                      <Col>
                        <Space size="middle">
                          <Button 
                            disabled={currentPage <= 1} 
                            onClick={() => {
                              setCurrentPage(prev => Math.max(1, prev - 1));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            icon={<RollbackOutlined />}
                          >
                            Öňki
                          </Button>
                          <Button 
                            type="primary"
                            disabled={currentPage >= Math.ceil(totalItems / pageSize)} 
                            onClick={() => {
                              setCurrentPage(prev => Math.min(Math.ceil(totalItems / pageSize), prev + 1));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                              border: 'none'
                            }}
                          >
                            Indiki
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </Card>
              )}

              {/* No Herbs Found */}
              {showRecommendations && !loading && herbs.length === 0 && (
                <Card 
                  bordered={false}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    textAlign: 'center'
                  }}
                  bodyStyle={{ padding: '60px 40px' }}
                >
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Space direction="vertical" size="large">
                        <Title level={4} style={{ color: '#666' }}>
                          Dermanlyk Ösümlikleri tapylmady
                        </Title>
                        <Button 
                          type="primary" 
                          onClick={() => fetchHerbs()}
                          icon={<ReloadOutlined />}
                          size="large"
                          style={{
                            background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                            border: 'none'
                          }}
                        >
                          Täzeden synaň
                        </Button>
                      </Space>
                    } 
                  />
                </Card>
              )}

              {/* Loading State */}
              {loading && (
                <Card 
                  bordered={false}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    textAlign: 'center'
                  }}
                  bodyStyle={{ padding: '80px 40px' }}
                >
                  <Spin size="large" tip={
                    <Text style={{ fontSize: '16px', marginTop: '16px', display: 'block' }}>
                      {searchTerm ? `"${searchTerm}" gözlenilýär...` : "Ösümlikler ýüklenýär..."}
                    </Text>
                  } />
                </Card>
              )}



              {/* Empty State */}
              {!loading && searchTerm && searchResults.length === 0 && (
                <Card 
                  bordered={false}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    textAlign: 'center'
                  }}
                  bodyStyle={{ padding: '60px 40px' }}
                >
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Space direction="vertical" size="large">
                        <Title level={4} style={{ color: '#666', margin: 0 }}>
                          "{searchTerm}" üçin netije tapylmady
                        </Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                          Başga açar sözler bilen synanyşyň
                        </Text>
                        <Button 
                          type="primary" 
                          onClick={() => {
                            setSearchResults([]);
                            setSearchTerm('');
                            setShowRecommendations(true);
                          }}
                          icon={<RollbackOutlined />}
                          size="large"
                          style={{
                            background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                            border: 'none'
                          }}
                        >
                          Ähli ösümlikleri gör
                        </Button>
                      </Space>
                    }
                  />
                </Card>
              )}
            </Col>
          </Row>
        </div>
      </Content>

      {/* Modern Professional Footer */}
      <Footer style={{ 
        background: '#ffffff',
        borderTop: '1px solid #e8e8e8',
        padding: '60px 50px 30px',
        marginTop: '60px'
      }}>
        <Row gutter={[48, 32]} justify="center">
          <Col xs={24} sm={24} md={8} lg={8}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space align="center" size="middle">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2c5530 0%, #52c41a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MedicineBoxOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <Title level={4} style={{ margin: 0, color: '#2c5530' }}>
                  Türkmenistanyň Dermanlyk Ösümlikleri
                </Title>
              </Space>
              <Paragraph style={{ color: '#666', marginBottom: 0 }}>
                Türkmenistanyň tebigatynyň baý dünýäsindäki dermanlyk ösümliklerine degişli giňişleýin maglumatlar bazasy
              </Paragraph>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <Title level={5} style={{ color: '#2c5530', marginBottom: '20px' }}>
              Biziň Salgylarymyz
            </Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space>
                <EnvironmentOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                <Text style={{ color: '#666' }}>Aşgabat ş., Türkmenistan</Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                <Text style={{ color: '#666' }}>+993 12 345678</Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                <Text style={{ color: '#666' }}>info@dermanlyk.tm</Text>
              </Space>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <Title level={5} style={{ color: '#2c5530', marginBottom: '20px' }}>
              Bizi yzarlaň
            </Title>
            <Space size="middle">
              <Button 
                shape="circle" 
                size="large"
                icon={<TwitterOutlined />} 
                style={{ 
                  background: '#f5f5f5',
                  border: 'none',
                  color: '#666'
                }} 
              />
              <Button 
                shape="circle" 
                size="large"
                icon={<GithubOutlined />} 
                style={{ 
                  background: '#f5f5f5',
                  border: 'none',
                  color: '#666'
                }} 
              />
              <Button 
                shape="circle" 
                size="large"
                icon={<LinkedinOutlined />} 
                style={{ 
                  background: '#f5f5f5',
                  border: 'none',
                  color: '#666'
                }} 
              />
            </Space>
          </Col>
        </Row>
        
        <Divider style={{ margin: '40px 0 24px 0', borderColor: '#e8e8e8' }} />
        
        <Row justify="center">
          <Col>
            <Text style={{ color: '#999', textAlign: 'center' }}>
              © 2025 Dermanlyk Ösümlikleri. Ähli hukuklar goragly.
            </Text>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default HomePage;
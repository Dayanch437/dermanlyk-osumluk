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
          kategoriýa: 'Derman ösümligi'
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
    <Layout style={{ minHeight: '100vh' }}>
      {/* Professional Header */}
      <Header style={{ 
        background: 'linear-gradient(135deg, #2c5530 0%, #3d7c47 100%)',
        padding: '0 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Row justify="space-between" align="middle">
          <Col xs={18} sm={12} md={8}>
            <Space align="center">
              <MedicineBoxOutlined style={{ fontSize: '24px', color: 'white' }} />
              <Title level={3} style={{ 
                color: 'white', 
                margin: 0,
                fontSize: 'clamp(16px, 2.5vw, 24px)'
              }}>
                Dermanlyk Ösümlikleri
              </Title>
            </Space>
          </Col>
          <Col xs={6} sm={12} md={16}>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="link" 
                icon={<HomeOutlined />} 
                style={{ color: 'white', display: isMobile ? 'none' : 'inline-flex' }}
              >
                Baş sahypa
              </Button>
              <Button 
                type="link" 
                icon={<BookOutlined />} 
                style={{ color: 'white', display: isMobile ? 'none' : 'inline-flex' }}
              >
                Kitaphana
              </Button>
              <Button 
                type="link" 
                icon={<HeartOutlined />} 
                style={{ color: 'white', display: isMobile ? 'none' : 'inline-flex' }}
              >
                Halanýanlar
              </Button>
            </Space>
          </Col>
        </Row>
      </Header>
      
      <Content style={{ padding: '0' }}>
        {/* Hero Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={16} xl={14}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={1} style={{ 
                    fontSize: 'clamp(2rem, 5vw, 3rem)', 
                    background: 'linear-gradient(135deg, #2c5530, #3d7c47)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '16px'
                  }}>
                    Dermanlyk Ösümlikleri
                  </Title>
                  <Title level={3} style={{ 
                    color: '#5a7c65', 
                    fontWeight: 400,
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)'
                  }}>
                    Türkmenistanyň Tebigy Hasabaty
                  </Title>
                  <Paragraph style={{ 
                    fontSize: 'clamp(14px, 2.5vw, 18px)', 
                    color: '#666',
                    maxWidth: '600px',
                    margin: '0 auto 40px',
                    lineHeight: '1.6'
                  }}>
                    Türkmenistanyň baý tebigat dünýäsindäki dermanlyk ösümlikleriň häsiýetleri, 
                    ýaşaýyş aýratynlyklary we peýdaly täsirleri barada giňişleýin maglumat
                  </Paragraph>
                </div>
                
                {/* Professional Search */}
                <Card style={{ 
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: 'none'
                }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Row gutter={[8, 8]} align="middle">
                      <Col flex="auto">
                        <AutoComplete
                          className="responsive-search"
                          style={{ width: '100%' }}
                          size={isMobile ? "middle" : "large"}
                          value={searchTerm}
                          options={suggestions}
                          onSearch={handleInputChange}
                          onSelect={(value) => {
                            // Navigate directly to detail page using the plant ID
                            navigate(`/osumlik/${value}`);
                          }}
                          placeholder={isMobile ? "Ösümlik gözle..." : "Ösümliginiň adyny ýazyň..."}
                          allowClear
                        />
                      </Col>
                      <Col flex="none">
                        <Button 
                          type="primary" 
                          icon={<SearchOutlined />}
                          loading={loading}
                          onClick={() => handleSearch(searchTerm)}
                          size={isMobile ? "middle" : "large"}
                          style={{
                            background: '#2c5530',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(44, 85, 48, 0.2)',
                            minWidth: isMobile ? '50px' : 'auto',
                            padding: isMobile ? '0 12px' : '0 24px',
                            fontSize: isMobile ? '14px' : '16px',
                            height: isMobile ? '40px' : '50px'
                          }}
                        >
                          {!isMobile ? 'GÖZLE' : ''}
                        </Button>
                      </Col>
                    </Row>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Content Section */}
        <div style={{ padding: '20px 15px 50px' }}>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              
        
              
              {/* Herb List - All Herbs */}
              {showRecommendations && !loading && herbs.length > 0 && (
                <div style={{ marginBottom: '50px' }}>
                  <Title level={3} style={{ marginBottom: '30px' }}>
                    <MedicineBoxOutlined style={{ marginRight: '8px' }} /> 
                    Dermanlyk Ösümlikleriň Sanawy
                  </Title>
                  
                  <div style={{ padding: '0 10px' }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={herbs}
                      renderItem={(herb) => (
                        <List.Item 
                          onClick={() => handleItemClick(herb)}
                          style={{ 
                            cursor: 'pointer',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            background: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease'
                          }}
                          className="herb-list-item"
                        >
                          <List.Item.Meta
                            avatar={<Avatar style={{ backgroundColor: '#2c5530' }}>{herb.ady?.charAt(0) || herb.name?.charAt(0)}</Avatar>}
                            title={<span style={{ fontSize: '16px' }}>{herb.ady || herb.name}</span>}
                            description={herb.character ? <span style={{ color: '#666' }}>{herb.character}</span> : null}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                  
                  {/* Pagination */}
                  <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'center',
                    padding: '12px',
                    background: '#f7f7f7',
                    borderRadius: '8px'
                  }}>
                    <Space>
                      <Button 
                        disabled={currentPage <= 1} 
                        onClick={() => {
                          setCurrentPage(prev => Math.max(1, prev - 1));
                          window.scrollTo(0, 0);
                        }}
                        style={{ background: '#ffffff' }}
                      >
                        Öňki
                      </Button>
                      <Text strong>Sahypa {currentPage} / {Math.ceil(totalItems / pageSize)}</Text>
                      <Button 
                        disabled={currentPage >= Math.ceil(totalItems / pageSize)} 
                        onClick={() => {
                          setCurrentPage(prev => Math.min(Math.ceil(totalItems / pageSize), prev + 1));
                          window.scrollTo(0, 0);
                        }}
                        style={{ background: '#ffffff' }}
                      >
                        Indiki
                      </Button>
                    </Space>
                  </div>
                </div>
              )}

              {/* No Herbs Found */}
              {showRecommendations && !loading && herbs.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '50px 20px',
                  margin: '20px 0',
                  background: '#f9f9f9',
                  borderRadius: '12px',
                  border: '1px dashed #ddd'
                }}>
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Paragraph style={{ fontSize: '16px', color: '#444', margin: '20px 0' }}>
                        Dermanlyk Ösümlikleri tapylmady
                      </Paragraph>
                    } 
                  />
                  <Button type="primary" onClick={() => fetchHerbs()} style={{ background: '#2c5530' }}>
                    <ReloadOutlined /> Täzeden synaň
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  margin: '20px 0',
                  background: '#f9f9f9',
                  borderRadius: '12px',
                  border: '1px dashed #ddd'
                }}>
                  <Spin size="large" tip={searchTerm ? `"${searchTerm}" gözlenilýär...` : "Ösümlikler ýüklenýär..."} />
                </div>
              )}

              {/* Search Results */}
              {!loading && searchResults.length > 0 && (
                <div>
                  <Row justify="space-between" align="middle" style={{ marginBottom: '30px' }}>
                    <Col>
                      <Title level={3} style={{ margin: 0 }}>
                        <SearchOutlined /> Gözleg netijeleri ({searchResults.length} sany tapyldy)
                      </Title>
                    </Col>
                    <Col>
                      <Button 
                        onClick={() => {
                          setSearchResults([]);
                          setSearchTerm('');
                          setShowRecommendations(true);
                        }}
                        icon={<RollbackOutlined />}
                      >
                        Doly sanawy gör
                      </Button>
                    </Col>
                  </Row>
                  <div style={{ padding: '0 10px' }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={searchResults}
                      renderItem={(osumlik) => (
                        <List.Item 
                          onClick={() => handleItemClick(osumlik)}
                          style={{ 
                            cursor: 'pointer',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            background: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease'
                          }}
                          className="herb-list-item"
                        >
                          <List.Item.Meta
                            avatar={<Avatar style={{ backgroundColor: '#2c5530' }}>{osumlik.ady?.charAt(0) || osumlik.name?.charAt(0)}</Avatar>}
                            title={<span style={{ fontSize: '16px' }}>{osumlik.ady || osumlik.name}</span>}
                            description={osumlik.character ? <span style={{ color: '#666' }}>{osumlik.character}</span> : null}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                  
                  {/* Pagination for search results */}
                  {searchResults.length > pageSize && (
                    <div style={{ 
                      marginTop: '20px', 
                      textAlign: 'center',
                      padding: '12px',
                      background: '#f7f7f7',
                      borderRadius: '8px'
                    }}>
                      <Button 
                        onClick={() => {
                          const currentSet = searchResults.slice(0, pageSize);
                          setSearchResults(currentSet);
                        }}
                        type="primary" 
                        style={{ background: '#2c5530' }}
                      >
                        İlki {pageSize} netijäni görkeziň
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!loading && searchTerm && searchResults.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '50px 20px',
                  margin: '20px 0',
                  background: '#f9f9f9',
                  borderRadius: '12px',
                  border: '1px dashed #ddd'
                }}>
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Space direction="vertical" size="large">
                        <Text style={{ fontSize: '18px', color: '#444' }}>
                          "{searchTerm}" üçin hiç zat tapylmady
                        </Text>
                        <Text style={{ color: '#777' }}>
                          Başga açar sözleri synanyşyň: alma, sarymsaküs, aýdogan
                        </Text>
                        <Button 
                          type="primary" 
                          onClick={() => {
                            setSearchResults([]);
                            setSearchTerm('');
                            setShowRecommendations(true);
                          }}
                          icon={<RollbackOutlined />}
                          style={{ marginTop: '20px' }}
                        >
                          Doly sanawy gör
                        </Button>
                      </Space>
                    }
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Content>

      {/* Professional Footer */}
      <Footer style={{ 
        background: '#001529',
        color: 'white',
        padding: '50px 50px 20px'
      }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={8}>
            <Space direction="vertical" size="middle">
              <Space align="center">
                <MedicineBoxOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                  Dermanlyk Ösümlikleri
                </Title>
              </Space>
              <Paragraph style={{ color: '#ccc' }}>
                Türkmenistanyň tebigatynyň baý dünýäsindäki derman ösümliklerine degişli giňişleýin maglumatlar bazasy
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Title level={4} style={{ color: 'white' }}>Biziň Salgylarymyz</Title>
            <Space direction="vertical" style={{ color: '#ccc' }}>
              <Space>
                <EnvironmentOutlined />
                <Text style={{ color: '#ccc' }}>Aşgabat ş., Bitarap Türkmenistan şaýoly, 12</Text>
              </Space>
              <Space>
                <PhoneOutlined />
                <Text style={{ color: '#ccc' }}>+993 12 345678</Text>
              </Space>
              <Space>
                <MailOutlined />
                <Text style={{ color: '#ccc' }}>dermanlyk@example.com</Text>
              </Space>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Title level={4} style={{ color: 'white' }}>Bizi yzarlaň</Title>
            <Space size="large">
              <Button shape="circle" icon={<TwitterOutlined />} style={{ background: 'transparent', borderColor: '#ccc', color: '#ccc' }} />
              <Button shape="circle" icon={<GithubOutlined />} style={{ background: 'transparent', borderColor: '#ccc', color: '#ccc' }} />
              <Button shape="circle" icon={<LinkedinOutlined />} style={{ background: 'transparent', borderColor: '#ccc', color: '#ccc' }} />
            </Space>
          </Col>
        </Row>
        <Divider style={{ background: '#333' }} />
        <div style={{ textAlign: 'center', color: '#999' }}>
          © 2025 Dermanlyk Ösümlikleri. Ähli hukuklar goralan.
        </div>
      </Footer>
    </Layout>
  );
};

export default HomePage;
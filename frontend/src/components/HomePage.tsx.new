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
  RollbackOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Osumlik {
  id: string | number;
  name: string;
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
  const pageSize = 50; // Show 50 items per page
  const navigate = useNavigate();

  // Fetch data from API when component mounts
  useEffect(() => {
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
        padding: '0 50px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <MedicineBoxOutlined style={{ fontSize: '24px', color: 'white' }} />
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                Dermanlyk Ösümlikleri
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button type="link" icon={<HomeOutlined />} style={{ color: 'white' }}>
                Baş sahypa
              </Button>
              <Button type="link" icon={<BookOutlined />} style={{ color: 'white' }}>
                Kitaphana
              </Button>
              <Button type="link" icon={<HeartOutlined />} style={{ color: 'white' }}>
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
          padding: '80px 50px',
          textAlign: 'center'
        }}>
          <Row justify="center">
            <Col xs={24} sm={20} md={16} lg={14}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={1} style={{ 
                    fontSize: '3rem', 
                    background: 'linear-gradient(135deg, #2c5530, #3d7c47)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '16px'
                  }}>
                    Dermanlyk Ösümlikleri
                  </Title>
                  <Title level={3} style={{ color: '#5a7c65', fontWeight: 400 }}>
                    Türkmenistanyň Tebigy Hasabaty
                  </Title>
                  <Paragraph style={{ 
                    fontSize: '18px', 
                    color: '#666',
                    maxWidth: '600px',
                    margin: '0 auto 40px'
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
                    <AutoComplete
                      style={{ width: '100%' }}
                      size="large"
                      value={searchTerm}
                      options={suggestions}
                      onSearch={handleInputChange}
                      onSelect={(value) => {
                        // Navigate directly to detail page using the plant ID
                        navigate(`/osumlik/${value}`);
                      }}
                      placeholder="Ösümliginiň adyny ýazyň..."
                      allowClear
                      suffixIcon={
                        <Button 
                          type="primary" 
                          icon={<SearchOutlined />}
                          loading={loading}
                          onClick={() => handleSearch(searchTerm)}
                          style={{
                            background: 'linear-gradient(135deg, #2c5530, #3d7c47)',
                            border: 'none',
                            borderRadius: '8px'
                          }}
                        >
                          GÖZLE
                        </Button>
                      }
                    />
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Content Section */}
        <div style={{ padding: '50px' }}>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18}>
              
              {/* Debug information */}
              <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f2f5', borderRadius: '5px' }}>
                <Text strong>Debug Info:</Text>
                <ul>
                  <li>Loading: {loading ? 'true' : 'false'}</li>
                  <li>Show Recommendations: {showRecommendations ? 'true' : 'false'}</li>
                  <li>Herbs Count: {herbs.length}</li>
                  <li>Search Results Count: {searchResults.length}</li>
                  <li>Current Page: {currentPage}</li>
                  <li>Total Items: {totalItems}</li>
                </ul>
              </div>
              
              {/* Herb List - All Herbs */}
              {showRecommendations && !loading && herbs.length > 0 && (
                <div style={{ marginBottom: '50px' }}>
                  <Title level={3} style={{ marginBottom: '30px' }}>
                    <MedicineBoxOutlined style={{ marginRight: '8px' }} /> 
                    Dermanlyk Ösümlikleriň Sanawy
                  </Title>
                  
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
                    dataSource={herbs}
                    renderItem={(herb) => (
                      <List.Item>
                        <Card
                          hoverable
                          onClick={() => handleItemClick(herb)}
                          style={{ 
                            borderRadius: '8px',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Card.Meta
                            avatar={<Avatar style={{ backgroundColor: '#2c5530' }}>{herb.ady?.charAt(0) || herb.name?.charAt(0)}</Avatar>}
                            title={herb.ady || herb.name}
                          />
                        </Card>
                      </List.Item>
                    )}
                    pagination={{
                      onChange: (page) => {
                        console.log(`Changing to page ${page}`);
                        setCurrentPage(page);
                        window.scrollTo(0, 0);
                      },
                      pageSize: pageSize,
                      current: currentPage,
                      total: totalItems,
                      showSizeChanger: false,
                      showQuickJumper: true,
                      showTotal: (total) => `${total} ösümlik`
                    }}
                  />
                </div>
              )}

              {/* No Herbs Found */}
              {showRecommendations && !loading && herbs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <Empty 
                    description={
                      <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                        Dermanlyk Ösümlikleri tapylmady
                      </Paragraph>
                    } 
                  />
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>
                    {searchTerm ? `"${searchTerm}" gözlenilýär...` : "Ösümlikler ýüklenýär..."}
                  </div>
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
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
                    dataSource={searchResults}
                    renderItem={(osumlik) => (
                      <List.Item>
                        <Card
                          hoverable
                          onClick={() => handleItemClick(osumlik)}
                          style={{ 
                            borderRadius: '8px',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Card.Meta
                            avatar={<Avatar style={{ backgroundColor: '#2c5530' }}>{osumlik.ady?.charAt(0) || osumlik.name?.charAt(0)}</Avatar>}
                            title={osumlik.ady || osumlik.name}
                          />
                        </Card>
                      </List.Item>
                    )}
                    pagination={searchResults.length > pageSize ? {
                      pageSize: pageSize,
                      simple: true,
                      hideOnSinglePage: true
                    } : false}
                  />
                </div>
              )}

              {/* Empty State */}
              {!loading && searchTerm && searchResults.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <Empty 
                    description={
                      <Space direction="vertical">
                        <Text style={{ fontSize: '18px', color: '#666' }}>
                          "{searchTerm}" üçin hiç zat tapylmady
                        </Text>
                        <Text style={{ color: '#999' }}>
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
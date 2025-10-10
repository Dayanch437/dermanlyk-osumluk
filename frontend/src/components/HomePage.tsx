import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Input,
  Button,
  Card,
  List,
  Typography,
  Space,
  Spin,
  Empty,
  Row,
  Col,
  Tag,
  AutoComplete,
  Divider,
  Avatar,
} from 'antd';
import { wordService } from '../services/api';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  HeartOutlined,
  StarOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
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
  const navigate = useNavigate();

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        setLoading(true);
        // Fetch herbs from API
        const response = await wordService.searchWords('', {}, 1, 100);
        
        // Map API response to local structure
        console.log('API Response herbs:', response.results);
        const apiHerbs = response.results.map((herb: any) => {
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
            photo: herb.photo || null, // Add photo field
            photo_url: herb.photo_url || null, // Add photo_url field
            
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
          console.log('Mapped herb with photo:', mappedHerb.photo);
          return mappedHerb;
        });
        
        setHerbs(apiHerbs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching herbs:', error);
        setLoading(false);
        // Fallback to empty array
        setHerbs([]);
      }
    };
    
    fetchHerbs();
  }, []);

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
    setShowRecommendations(false);
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
      // Use the API service to search
      const response = await wordService.searchWords(value, {}, 1, 20);
      
      // Map API response to local structure (same mapping as in useEffect)
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
        photo: herb.photo || null, // Add photo field
        photo_url: herb.photo_url || null, // Add photo_url field
        
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
      }));
      
      setSearchResults(apiResults);
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
              photo: herb.photo || null, // Add photo field
              photo_url: herb.photo_url || null, // Add photo_url field
              
              // Legacy mappings
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
              
              {/* Popular Recommendations - REMOVED */}
              {showRecommendations && !loading && (
                <div style={{ marginBottom: '50px' }}>
                  {/* Features Section */}
                  <Row gutter={[32, 32]}>
                    <Col xs={24} sm={8}>
                      <Card style={{ textAlign: 'center', height: '200px', borderRadius: '12px' }}>
                        <ExperimentOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                        <Title level={4}>Ylmy Maglumatlar</Title>
                        <Text style={{ color: '#666' }}>
                          Her ösümlik üçin ylmy taýdan tassyklanan maglumatlar
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card style={{ textAlign: 'center', height: '200px', borderRadius: '12px' }}>
                        <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                        <Title level={4}>Ygtybarly Maglumat</Title>
                        <Text style={{ color: '#666' }}>
                          Türkmenistanyň döwlet tarapyndan tassyklanan maglumatlar
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card style={{ textAlign: 'center', height: '200px', borderRadius: '12px' }}>
                        <HeartOutlined style={{ fontSize: '48px', color: '#f5222d', marginBottom: '16px' }} />
                        <Title level={4}>Sagdyn Durmuş</Title>
                        <Text style={{ color: '#666' }}>
                          Tebigy dermanlar bilen sagdyn durmuş sürmek
                        </Text>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>
                    "{searchTerm}" gözlenilýär...
                  </div>
                </div>
              )}

              {/* Search Results */}
              {!loading && searchResults.length > 0 && (
                <div>
                  <Title level={3} style={{ marginBottom: '30px' }}>
                    <SearchOutlined /> Gözleg netijeleri ({searchResults.length} sany tapyldy)
                  </Title>
                  <List
                    grid={{ gutter: [24, 24], xs: 1, sm: 1, md: 2, lg: 2 }}
                    dataSource={searchResults}
                    renderItem={(osumlik) => (
                      <List.Item>
                        <Card
                          hoverable
                          onClick={() => handleItemClick(osumlik)}
                          style={{ 
                            borderRadius: '16px',
                            overflow: 'hidden',
                            height: '300px'
                          }}
                          cover={
                            (osumlik.photo_url || osumlik.photo) ? (
                              <div style={{ 
                                height: '80px',
                                overflow: 'hidden'
                              }}>
                                <img 
                                  src={osumlik.photo_url || (osumlik.photo?.startsWith('http') 
                                    ? osumlik.photo 
                                    : `http://localhost:8000${osumlik.photo}`)}
                                  alt={osumlik.ady || osumlik.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    console.error('Image loading error:', e);
                                    // Fallback to emoji
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.innerHTML = '🌿';
                                  }}
                                />
                              </div>
                            ) : (
                              <div style={{ 
                                height: '80px', 
                                background: 'linear-gradient(135deg, #f0f9f0, #e8f5e8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px'
                              }}>
                                {osumlik.suraty || '🌿'}
                              </div>
                            )
                          }
                          actions={[
                            <Button type="link" icon={<HeartOutlined />}>Halanýanlar</Button>,
                            <Button type="link" icon={<BookOutlined />}>Maglumat</Button>
                          ]}
                        >
                          <Card.Meta
                            title={
                              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Text strong style={{ fontSize: '18px' }}>{osumlik.ady}</Text>
                                <Tag color="green">{osumlik.kategoriýa}</Tag>
                              </Space>
                            }
                            description={
                              <Space direction="vertical" style={{ width: '100%' }}>
                                <Text style={{ color: '#666' }}>{osumlik.hasiyeti}</Text>
                                <Space>
                                  <EnvironmentOutlined style={{ color: '#1890ff' }} />
                                  <Text style={{ fontSize: '12px' }}>{osumlik.yayraway}</Text>
                                </Space>
                              </Space>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
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
              <Text style={{ color: '#ccc' }}>
                Türkmenistanyň tebigy baylyklaryny öwrenmek we goramak üçin döredilen platforma.
              </Text>
              <Space>
                <Button type="link" icon={<GithubOutlined />} style={{ color: '#ccc' }} />
                <Button type="link" icon={<TwitterOutlined />} style={{ color: '#ccc' }} />
                <Button type="link" icon={<LinkedinOutlined />} style={{ color: '#ccc' }} />
              </Space>
            </Space>
          </Col>
          
          <Col xs={24} sm={8}>
            <Space direction="vertical" size="middle">
              <Title level={5} style={{ color: 'white' }}>Baglanyşyk</Title>
              <Space direction="vertical">
                <Space>
                  <PhoneOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ color: '#ccc' }}>+993 12 345-678</Text>
                </Space>
                <Space>
                  <MailOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ color: '#ccc' }}>info@dermanlyk.tm</Text>
                </Space>
                <Space>
                  <EnvironmentOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ color: '#ccc' }}>Aşgabat, Türkmenistan</Text>
                </Space>
              </Space>
            </Space>
          </Col>
          
          <Col xs={24} sm={8}>
            <Space direction="vertical" size="middle">
              <Title level={5} style={{ color: 'white' }}>Maglumatlar</Title>
              <Space direction="vertical">
                <Button type="link" style={{ color: '#ccc', padding: 0 }}>Baş sahypa</Button>
                <Button type="link" style={{ color: '#ccc', padding: 0 }}>Ösümlikler</Button>
                <Button type="link" style={{ color: '#ccc', padding: 0 }}>Gözleg</Button>
                <Button type="link" style={{ color: '#ccc', padding: 0 }}>Biz barada</Button>
              </Space>
            </Space>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: '#333', margin: '40px 0 20px' }} />
        
        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ color: '#666' }}>
              © 2025 Dermanlyk Ösümlikleri. Ähli hukuklar goragly.
            </Text>
          </Col>
          <Col>
            <Text style={{ color: '#666' }}>
              Gurbanguly Berdimuhamedow tarapyndan ýazylan
            </Text>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default HomePage;

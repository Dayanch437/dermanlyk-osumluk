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
  id: string;
  ady: string;
  hasiyeti: string;
  yasayys_ayratynlygy: string;
  yayraway: string;
  tegigy: string;
  gory: string;
  cig_maly: string;
  himiki_duzumi: string;
  peydaly_nys: string;
  suraty: string;
  kategoriýa: string;
}

const HomePage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Osumlik[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{value: string, label: string}[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const navigate = useNavigate();

  // Turkmen medicinal plants database
  const mockOsumlikler: Osumlik[] = [
    {
      id: '1',
      ady: 'Alma',
      hasiyeti: 'Witaminlara baý, aşgazan-içege peýdaly',
      yasayys_ayratynlygy: 'Temperaturaly klimatda öser',
      yayraway: 'Günorta Aziýa',
      tegigy: 'Rosaceae',
      gory: 'Malus',
      cig_maly: 'Meýwe',
      himiki_duzumi: 'Witamin C, şeker, organiki kislotalar',
      peydaly_nys: 'Aşgazan işini gowulandyrýar, immuniteti güýçlendirýär',
      suraty: '🍎',
      kategoriýa: 'Meýweli ösümlik'
    },
    {
      id: '2',
      ady: 'Sarymsaküs',
      hasiyeti: 'Antibakterial, immunomodulirujuşy täsir',
      yasayys_ayratynlygy: 'Gury we çygly toprakda öser',
      yayraway: 'Orta Aziýa',
      tegigy: 'Amaryllidaceae',
      gory: 'Allium',
      cig_maly: 'Baş',
      himiki_duzumi: 'Allitsin, efir ýaglary, witaminler',
      peydaly_nys: 'Mikroblara garşy göreşýär, gan basyşyny kadalaşdyrýar',
      suraty: '🧄',
      kategoriýa: 'Antibakterial ösümlik'
    },
    {
      id: '3',
      ady: 'Aýdogan',
      hasiyeti: 'Ýatşylandyryjy, antioksidant täsir',
      yasayys_ayratynlygy: 'Guraň topraklarda öser',
      yayraway: 'Türkmenistan',
      tegigy: 'Lamiaceae',
      gory: 'Salvia',
      cig_maly: 'Ýaprak',
      himiki_duzumi: 'Efir ýaglary, flavonoidler',
      peydaly_nys: 'Nerw ulgamyny rahatlady, ukynyň hilini gowulaşdyrýar',
      suraty: '🌿',
      kategoriýa: 'Ýatşylandyryjy ösümlik'
    },
    {
      id: '4',
      ady: 'Narpyz',
      hasiyeti: 'Aşgazany güýçlendirýär, dem alşy aňsatlaşdyrýar',
      yasayys_ayratynlygy: 'Çygly topraklarda öser',
      yayraway: 'Ýewropa',
      tegigy: 'Lamiaceae',
      gory: 'Mentha',
      cig_maly: 'Ýaprak',
      himiki_duzumi: 'Mentol, efir ýaglary',
      peydaly_nys: 'Aşgazan agyrylaryny kämeltýär, dem alşy aňsatlaşdyrýar',
      suraty: '🌱',
      kategoriýa: 'Ýerli ösümlik'
    },
    {
      id: '5',
      ady: 'Öwezlilik',
      hasiyeti: 'Ykjam ediji, ýara bejermek üçin',
      yasayys_ayratynlygy: 'Gury şertlerde öser',
      yayraway: 'Türkmenistan',
      tegigy: 'Fabaceae',
      gory: 'Glycyrrhiza',
      cig_maly: 'Kök',
      himiki_duzumi: 'Glitsirizin, flavonoidler',
      peydaly_nys: 'Ýaralary bejerýär, içegäni çişdirýär',
      suraty: '🌾',
      kategoriýa: 'Ykjam ediji ösümlik'
    },
    {
      id: '6',
      ady: 'Garagat',
      hasiyeti: 'Antioksidant, göze peýdaly',
      yasayys_ayratynlygy: 'Sowuk klimatda öser',
      yayraway: 'Demirgazyk Ýewropa',
      tegigy: 'Ericaceae',
      gory: 'Vaccinium',
      cig_maly: 'Meýwe',
      himiki_duzumi: 'Antosianlar, witamin C',
      peydaly_nys: 'Göz düşünjäni gowulaşdyrýar, garrylyk garşy alýar',
      suraty: '🫐',
      kategoriýa: 'Antioksidant ösümlik'
    },
    {
      id: '7',
      ady: 'Çaý',
      hasiyeti: 'Güýç beriji, antioksidant',
      yasayys_ayratynlygy: 'Tropiki klimatda öser',
      yayraway: 'Hytaý',
      tegigy: 'Theaceae',
      gory: 'Camellia',
      cig_maly: 'Ýaprak',
      himiki_duzumi: 'Kofein, tannindler, antioksidantlar',
      peydaly_nys: 'Güýç berýär, ýadyny gowulaşdyrýar',
      suraty: '🍃',
      kategoriýa: 'Güýçlendiriji ösümlik'
    },
    {
      id: '8',
      ady: 'Limon',
      hasiyeti: 'Witamin C-e baý, immunitet güýçlendiriji',
      yasayys_ayratynlygy: 'Subtropiki klimatda öser',
      yayraway: 'Günorta Aziýa',
      tegigy: 'Rutaceae',
      gory: 'Citrus',
      cig_maly: 'Meýwe',
      himiki_duzumi: 'Witamin C, limon kislotasy, efir ýaglary',
      peydaly_nys: 'Immunitet güýçlendirýär, detoks täsir ediýär',
      suraty: '🍋',
      kategoriýa: 'Witaminly ösümlik'
    }
  ];

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setSuggestions([]);
      setShowRecommendations(true);
      return;
    }

    // Generate suggestions with plant IDs for direct navigation
    const filteredSuggestions = mockOsumlikler
      .filter(osumlik => 
        osumlik.ady.toLowerCase().includes(value.toLowerCase()) ||
        osumlik.kategoriýa.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5)
      .map(osumlik => ({
        value: osumlik.id, // Use ID instead of name for direct navigation
        label: `${osumlik.suraty} ${osumlik.ady} - ${osumlik.kategoriýa}`
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

    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = mockOsumlikler.filter(osumlik => 
        osumlik.ady.toLowerCase().includes(value.toLowerCase()) ||
        osumlik.hasiyeti.toLowerCase().includes(value.toLowerCase()) ||
        osumlik.kategoriýa.toLowerCase().includes(value.toLowerCase()) ||
        osumlik.yayraway.toLowerCase().includes(value.toLowerCase()) ||
        osumlik.peydaly_nys.toLowerCase().includes(value.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setLoading(false);
    }, 300);
  };

  // Debounced search for real-time results
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        // Inline search to avoid dependency issues
        const filteredResults = mockOsumlikler.filter(osumlik => 
          osumlik.ady.toLowerCase().includes(searchTerm.toLowerCase()) ||
          osumlik.hasiyeti.toLowerCase().includes(searchTerm.toLowerCase()) ||
          osumlik.kategoriýa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          osumlik.yayraway.toLowerCase().includes(searchTerm.toLowerCase()) ||
          osumlik.peydaly_nys.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
                            <div style={{ 
                              height: '80px', 
                              background: 'linear-gradient(135deg, #f0f9f0, #e8f5e8)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '40px'
                            }}>
                              {osumlik.suraty}
                            </div>
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

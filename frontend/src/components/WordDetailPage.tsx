import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Typography,
  Space,
  Button,
  Divider,
  Tag,
  List,
  Row,
  Col,
  Spin,
  Alert,
} from 'antd';
import { wordService } from '../services/api';
import { 
  ArrowLeftOutlined, 
  EnvironmentOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface OsumlukMaglumaty {
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
  photo?: string; // New field for backend photo URL (relative path)
  photo_url?: string; // Full URL to the photo
  kategoriýa: string;
  goşmaça_maglumat?: string[];
  peýdanyş_usuly?: string[];
  duýduryş?: string;
}

const WordDetailPage: React.FC = () => {
  const { wordId } = useParams<{ wordId: string }>();
  const navigate = useNavigate();
  const [osumlukMaglumaty, setOsumlukMaglumaty] = useState<OsumlukMaglumaty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dermanlyk ösümlikleriň jikme-jik maglumatlary
  const mockOsumlukMaglumatlary: { [key: string]: OsumlukMaglumaty } = {
    '1': {
      id: '1',
      ady: 'Alma',
      hasiyeti: 'Witaminlara baý, aşgazan-içege peýdaly',
      yasayys_ayratynlygy: 'Temperaturaly klimatda öser, ýylyň dowamynda 15-25°C temperatury halaýar',
      yayraway: 'Günorta Aziýa, häzirki döwürde bütin dünýäde ösdürilýär',
      tegigy: 'Rosaceae maşgalasy',
      gory: 'Malus domestica',
      cig_maly: 'Alma şiresi, gabygy, tohumy, ýapraky',
      himiki_duzumi: 'Witamin C (4-10 mg/100g), Fiber (2.4g/100g), Potassium (107mg/100g), Antiosidantlar',
      peydaly_nys: 'Holesterini peseldýär, sakarnyn derejesini kadalaşdyrýar, aşgazanyň işini gowulaşdyrýar',
      suraty: '/images/alma.jpg',
      kategoriýa: 'Miweli ösümlik',
      goşmaça_maglumat: [
        'Almada 25 görnüş organiki kislota bar',
        'Bir almada gündelik B witamininiň zerurlygynyň 10%-i bar',
        'Alma gabygynda köp sanly peýdaly maddalar jemlenen'
      ],
      peýdanyş_usuly: [
        'Günde 1-2 sany iýmek',
        'Şire görnüşinde içmek',
        'Gabygyny bilen bilelikde iýmek has peýdaly'
      ],
      duýduryş: 'Artykmaç iýmek aşgazan problemalaryna sebäp bolup biler'
    },
    '2': {
      id: '2',
      ady: 'Sarymsaküs',
      hasiyeti: 'Antibakterial, antiwiral, immuniteti güýçlendiriji',
      yasayys_ayratynlygy: 'Gury, yssy klimatda öser, sowuk şertlere çydaýar',
      yayraway: 'Orta Aziýa, Günbatar Aziýa',
      tegigy: 'Amaryllidaceae maşgalasy',
      gory: 'Allium sativum',
      cig_maly: 'Baş (gözler), ýapraklar',
      himiki_duzumi: 'Allicin, Sulfur birleşmeleri, Witamin C, Mangan, Selen',
      peydaly_nys: 'Wirusa we bakteriýa garşy göreş, gan basyşyny kadalaşdyrýar, holesterini azaldýar',
      suraty: '/images/sarymsakus.jpg',
      kategoriýa: 'Dermanlyk ösümlik',
      goşmaça_maglumat: [
        'Sarymsaküsde 40-dan gowrak aktiwli birleşme bar',
        'Antibiotiklere garşy immuniteti ýokarlandyrýar',
        'Kalp-damar kesellerini öňüni alýar'
      ],
      peýdanyş_usuly: [
        'Günde 1-2 diş çiň iýmek',
        'Nahar bilen bilelikde ulanmak',
        'Çaý görnüşinde demlemek'
      ],
      duýduryş: 'Artykmaç ulanmak aşgazan agyrylaryna sebäp bolup biler'
    },
    '3': {
      id: '3',
      ady: 'Aýdogan',
      hasiyeti: 'Ýatlaýjy, rahatlendiriji, antiseptik täsirli',
      yasayys_ayratynlygy: 'Dagly sebitlerde, gury toprakda öser',
      yayraway: 'Merkezi Aziýa, Günbatar Aziýa, Ýewropa',
      tegigy: 'Lamiaceae maşgalasy',
      gory: 'Lavandula angustifolia',
      cig_maly: 'Güller, ýapraklar, baldaklar',
      himiki_duzumi: 'Efirnë ýagy (1-3%), Linalool, Kamfor, Tannin',
      peydaly_nys: 'Stressi azaldýar, ukynyň hili gowulaşdyrýar, ýara bejeriji',
      suraty: '/images/aydogan.jpg',
      kategoriýa: 'Aromaterapi ösümlik',
      goşmaça_maglumat: [
        'Aýdoganyň ysy asab ulgamyny köşeşdirýär',
        'Antiseptik häsiýetleri bar',
        'Düşde görmek we ýatlamak üçin peýdaly'
      ],
      peýdanyş_usuly: [
        'Çaý görnüşinde demlemek',
        'Aromaterapi üçin ulanmak',
        'Banja üçin suwa goşmak'
      ],
      duýduryş: 'Allergiki reaksiýa döredip biler'
    },
    '4': {
      id: '4',
      ady: 'Narpyz',
      hasiyeti: 'Soý degişli kesellere garşy täsirli, aşgazana peýdaly',
      yasayys_ayratynlygy: 'Nemli ýerlerde öser, çalt köpelýär',
      yayraway: 'Ýewropa we Aziýa',
      tegigy: 'Lamiaceae maşgalasy',
      gory: 'Mentha piperita',
      cig_maly: 'Ýapraklar, baldaklar',
      himiki_duzumi: 'Mentol (30-50%), Efirnë ýagy, Tannin',
      peydaly_nys: 'Aşgazan agyrysyny azaldýar, dem alyşy ýeňilleşdirýär, baş agyrysyny geçirýär',
      suraty: '/images/narpyz.jpg',
      kategoriýa: 'Dermanlyk ösümlik',
      goşmaça_maglumat: [
        'Narpyz iň köp ulanylýan dermanlyk ösümliklerden biri',
        'Mentol içerigi sebäpli sowagtyryjy täsir edýär',
        'Aşgazan we içege problemalaryna peýdaly'
      ],
      peýdanyş_usuly: [
        'Çaý görnüşinde içmek',
        'Inhalýasiýa üçin ulanmak',
        'Nahar soň iýmek'
      ],
      duýduryş: 'Artykmaç ulanmak aşgazany gyjyndyryp biler'
    },
    '7': {
      id: '7',
      ady: 'Çaý',
      hasiyeti: 'Antioksidant, tonus beriji, akyly güýçlendiriji',
      yasayys_ayratynlygy: 'Ýylylyk we çyglylygy halaýar, daglyk ýerlerde öser',
      yayraway: 'Günorta-Gündogar Aziýa (Hytaý, Hindistan)',
      tegigy: 'Theaceae maşgalasy',
      gory: 'Camellia sinensis',
      cig_maly: 'Ýaşyl ýapraklar, pägimler',
      himiki_duzumi: 'Kofein (2-4%), Tannin, L-theanin, Katehiner',
      peydaly_nys: 'Akylyň işini gowulaşdyrýar, ýadaşy güýçlendirýär, antioksidant täsir',
      suraty: '/images/cay.jpg',
      kategoriýa: 'Dermanlyk ösümlik',
      goşmaça_maglumat: [
        'Dünýäde iň köp içilýän içgilerden biri',
        'Ýaşyl çaýda has köp antioksidant bar',
        'L-theanin amino kislotasy stressi azaldýar'
      ],
      peýdanyş_usuly: [
        'Günde 2-3 käse içmek',
        'Aş bilen däl, arasynda içmek',
        'Yssy suw bilen demlemek'
      ],
      duýduryş: 'Artykmaç içmek uky kemseldip biler'
    },
    '8': {
      id: '8',
      ady: 'Limon',
      hasiyeti: 'Witamin C-iň baý çeşmesi, immunitet güýçlendiriji',
      yasayys_ayratynlygy: 'Subtropiki klimatda öser, doňa çydamaýar',
      yayraway: 'Günorta Aziýa, häzir bütin subtropiklerde ösdürilýär',
      tegigy: 'Rutaceae maşgalasy',
      gory: 'Citrus limon',
      cig_maly: 'Miwe, gabygy, ýapraky, gül',
      himiki_duzumi: 'Witamin C (50mg/100g), Limon kislotasy, Efirnë ýagy, Flavonoidler',
      peydaly_nys: 'Sowuklyga garşy söweş, detoksifikasiýa, immunitet ýokarlandyryş',
      suraty: '/images/limon.jpg',
      kategoriýa: 'Miweli ösümlik',
      goşmaça_maglumat: [
        'Bir limon gündelik witamin C zerurlygynyň 50%-ini berýär',
        'Limon gabygy köp peýdaly madda saklaýar',
        'Antibakterial we antiwiral häsiýetleri bar'
      ],
      peýdanyş_usuly: [
        'Suw bilen garyşdyryp içmek',
        'Nahar bilen ulanmak',
        'Çaý we şerbetlere goşmak'
      ],
      duýduryş: 'Artykmaç ulanmak diş enameline zyýan berip biler'
    }
  };

  useEffect(() => {
    const fetchOsumlukMaglumaty = async () => {
      if (!wordId) return;
      
      setLoading(true);
      setError(null);

      try {
        // Fetch data from API instead of mock data
        const apiData = await wordService.getWordDetail(wordId);
        
        // Map API response to OsumlukMaglumaty structure
        const maglumat: OsumlukMaglumaty = {
          id: apiData.id,
          ady: apiData.word || apiData.name,
          hasiyeti: apiData.character || '',
          yasayys_ayratynlygy: apiData.living_specification || '',
          yayraway: apiData.natural_source || '',
          tegigy: 'Theaceae maşgalasy', // Default family for now
          gory: 'Camellia sinensis', // Default genus for now
          cig_maly: apiData.raw_material_for_medicine || '',
          himiki_duzumi: apiData.chemical_composition || '',
          peydaly_nys: apiData.usage || '',
          suraty: '🌿', // Default emoji
          photo: apiData.photo || '', // New photo field from API
          photo_url: apiData.photo_url || '', // Full URL to the photo
          kategoriýa: 'Dermanlyk ösümlik',
          goşmaça_maglumat: ['Dermanlyk ösümlikleriň katalogyndan maglumat'],
          peýdanyş_usuly: ['Tebigy däri hökmünde ulanylýar'],
          duýduryş: 'Ulanmazdan öň lukmandan maslahat alyň'
        };
        
        setOsumlukMaglumaty(maglumat);
      } catch (err) {
        console.error('Error fetching herb details:', err);
        
        // Fallback to mock data if API fails
        const mockMaglumat = mockOsumlukMaglumatlary[wordId];
        if (mockMaglumat) {
          setOsumlukMaglumaty(mockMaglumat);
        } else {
          setError('Ösümlik tapylmady');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOsumlukMaglumaty();
  }, [wordId]);

  const handleBack = () => {
    navigate('/');
  };

  const getKategoriýaColor = (kategoriýa: string) => {
    const colors: { [key: string]: string } = {
      'Dermanlyk ösümlik': 'green',
      'Miweli ösümlik': 'orange',
      'Aromaterapi ösümlik': 'purple',
      'Gök önümler': 'blue',
    };
    return colors[kategoriýa] || 'default';
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  if (error || !osumlukMaglumaty) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <Content style={{ padding: '50px' }}>
          <Row justify="center">
            <Col xs={24} sm={20} md={16} lg={12}>
              <Card style={{ textAlign: 'center', padding: '40px' }}>
                <Alert
                  message="Ösümlik Tapylmady"
                  description={error || 'Talap edilýän ösümlik tapylmady.'}
                  type="error"
                  showIcon
                  style={{ marginBottom: '20px' }}
                />
                <Button type="primary" icon={<ArrowLeftOutlined />} onClick={handleBack}>
                  Gözlege gaýt
                </Button>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'white' }}>
      <Header style={{ 
        background: '#2d5016', 
        borderBottom: '3px solid #2d5016',
        padding: '0 50px'
      }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Col>
            <Space align="center">
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBack}
                style={{ color: 'white', border: 'none', fontFamily: 'serif' }}
              >
                Gözlege gaýt
              </Button>
            </Space>
          </Col>
          <Col>
            <Space align="center">
              <EnvironmentOutlined style={{ fontSize: '20px', color: 'white' }} />
              <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'serif' }}>
                Dermanlyk Ösümlikleri
              </Title>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: '50px', flex: 1 }}>
        <Row justify="center">
          <Col xs={24} sm={22} md={20} lg={16} xl={14}>
            <Card
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '2px solid #2d5016',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden'
              }}
            >
              {/* Ösümligiň surat we ady */}
              <div style={{ padding: '40px 40px 20px' }}>
                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} md={8}>
                    {(osumlukMaglumaty.photo_url || osumlukMaglumaty.photo) ? (
                      <div style={{
                        width: '100%',
                        height: '200px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        marginBottom: '20px'
                      }}>
                        <img 
                          src={osumlukMaglumaty.photo_url || (osumlukMaglumaty.photo?.startsWith('http') 
                            ? osumlukMaglumaty.photo 
                            : `http://localhost:8000${osumlukMaglumaty.photo}`)}
                          alt={osumlukMaglumaty.ady}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            console.error('Image loading error:', e);
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop
                            target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18">🌿</text></svg>';
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '200px',
                        borderRadius: '16px',
                        background: 'linear-gradient(45deg, #2d5016, #4a7c3a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '48px',
                        fontWeight: 'bold',
                        fontFamily: 'serif',
                        marginBottom: '20px'
                      }}>
                        {osumlukMaglumaty.ady.charAt(0)}
                      </div>
                    )}
                  </Col>
                  <Col xs={24} md={16}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Title level={1} style={{ margin: 0, color: '#2d5016', fontSize: '3rem', fontFamily: 'serif' }}>
                        {osumlukMaglumaty.ady}
                      </Title>
                      <Space size="small">
                        <Tag color={getKategoriýaColor(osumlukMaglumaty.kategoriýa)} style={{ fontSize: '14px', padding: '4px 12px', fontFamily: 'serif' }}>
                          {osumlukMaglumaty.kategoriýa}
                        </Tag>
                      </Space>
                      <Text style={{ fontSize: '16px', color: '#666', fontStyle: 'italic', fontFamily: 'serif' }}>
                        <strong>Ylmy ady:</strong> {osumlukMaglumaty.gory}
                      </Text>
                    </Space>
                  </Col>
                </Row>
              </div>

              <Divider style={{ margin: '0 40px 30px' }} />

              {/* Häsiýeti */}
              <div style={{ padding: '0 40px 30px' }}>
                <Title level={3} style={{ color: '#2d5016', marginBottom: '15px', fontFamily: 'serif' }}>
                  <MedicineBoxOutlined style={{ marginRight: '8px' }} />
                  Häsiýeti
                </Title>
                <Paragraph style={{ fontSize: '18px', lineHeight: '1.6', color: '#444', fontFamily: 'serif' }}>
                  {osumlukMaglumaty.hasiyeti}
                </Paragraph>
              </div>

              {/* Ýaşaýyş aýratynlygy */}
              <div style={{ padding: '0 40px 30px' }}>
                <Title level={3} style={{ color: '#2d5016', marginBottom: '15px', fontFamily: 'serif' }}>
                  <EnvironmentOutlined style={{ marginRight: '8px' }} />
                  Ýaşaýyş Aýratynlygy
                </Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', fontFamily: 'serif' }}>
                  {osumlukMaglumaty.yasayys_ayratynlygy}
                </Paragraph>
              </div>

              {/* Himiki düzümi */}
              <div style={{ padding: '0 40px 30px' }}>
                <Title level={3} style={{ color: '#2d5016', marginBottom: '15px', fontFamily: 'serif' }}>
                  <ExperimentOutlined style={{ marginRight: '8px' }} />
                  Himiki Düzümi
                </Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: '#444', fontFamily: 'serif' }}>
                  {osumlukMaglumaty.himiki_duzumi}
                </Paragraph>
              </div>

              {/* Peýdaly täsiri */}
              <div style={{ padding: '0 40px 30px' }}>
                <Title level={3} style={{ color: '#2d5016', marginBottom: '15px', fontFamily: 'serif' }}>
                  <InfoCircleOutlined style={{ marginRight: '8px' }} />
                  Peýdaly Täsiri
                </Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: '#444', fontFamily: 'serif' }}>
                  {osumlukMaglumaty.peydaly_nys}
                </Paragraph>
              </div>

              {/* Goşmaça maglumatlar */}
              {osumlukMaglumaty.goşmaça_maglumat && osumlukMaglumaty.goşmaça_maglumat.length > 0 && (
                <div style={{ padding: '0 40px 30px' }}>
                  <Title level={3} style={{ color: '#2d5016', marginBottom: '15px', fontFamily: 'serif' }}>
                    Goşmaça Maglumatlar
                  </Title>
                  <List
                    dataSource={osumlukMaglumaty.goşmaça_maglumat}
                    renderItem={(maglumat, index) => (
                      <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                        <Space align="start">
                          <Text style={{ 
                            background: '#2d5016', 
                            color: 'white', 
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </Text>
                          <Text style={{ fontSize: '16px', lineHeight: '1.6', fontFamily: 'serif' }}>
                            {maglumat}
                          </Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
              )}

              {/* Ulanýyş usuly */}
              {osumlukMaglumaty.peýdanyş_usuly && osumlukMaglumaty.peýdanyş_usuly.length > 0 && (
                <div style={{ padding: '0 40px 30px' }}>
                  <Card 
                    size="small" 
                    title="Ulanýyş Usuly" 
                    style={{ 
                      background: '#f0f9ff',
                      border: '2px solid #2d5016',
                      fontFamily: 'serif'
                    }}
                  >
                    <List
                      dataSource={osumlukMaglumaty.peýdanyş_usuly}
                      renderItem={(usul, index) => (
                        <List.Item style={{ borderBottom: 'none', padding: '4px 0' }}>
                          <Text style={{ fontFamily: 'serif' }}>• {usul}</Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                </div>
              )}

              {/* Duýduryş */}
              {osumlukMaglumaty.duýduryş && (
                <div style={{ padding: '0 40px 40px' }}>
                  <Alert
                    message="Duýduryş"
                    description={osumlukMaglumaty.duýduryş}
                    type="warning"
                    showIcon
                    style={{ fontFamily: 'serif' }}
                  />
                </div>
              )}

              {/* Maglumaty */}
              <Row gutter={[24, 24]} style={{ padding: '0 40px 40px' }}>
                <Col xs={24} md={12}>
                  <Card size="small" title="Ýaýrawy" style={{ background: '#f6ffed', border: '1px solid #b7eb8f', fontFamily: 'serif' }}>
                    <Text style={{ fontFamily: 'serif' }}>{osumlukMaglumaty.yayraway}</Text>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title="Tegigy" style={{ background: '#fff2f0', border: '1px solid #ffccc7', fontFamily: 'serif' }}>
                    <Text style={{ fontFamily: 'serif' }}>{osumlukMaglumaty.tegigy}</Text>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default WordDetailPage;
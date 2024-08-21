'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css'

export default function ConsultarPage() {
  const [cnpj, setCnpj] = useState('');
  const [companyData, setCompanyData] = useState<CnpjResponseDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpj(e.target.value);
  };

  const formatCnpj = (cnpj: string) => {
    return cnpj.replace(/\D/g, '');
  };

  const handleSearch = async () => {
    try {
      const formattedCnpj = formatCnpj(cnpj);
      if (formattedCnpj.length !== 14) {
        toast.error('CNPJ inválido. Por favor, insira um CNPJ válido.');
        return;
      }

      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${formattedCnpj}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar informações. Verifique o CNPJ e tente novamente.');
      }

      const data: CnpjResponseDto = await response.json();
      setCompanyData(data);
      toast.success('Consulta realizada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CnpjResponseDto) => {
    if (companyData) {
      setCompanyData({
        ...companyData,
        [field]: e.target.value,
      });
    }
  };

  const handleSubmit = async () => {
    if (companyData) {
      try {
        // Simula a submissão dos dados (troque a URL pela de sua API de submissão real)
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(companyData),
        });

        if (!response.ok) {
          throw new Error('Erro ao submeter os dados. Tente novamente.');
        }

        toast.success('Dados submetidos com sucesso!');
        setIsEditing(false);
      } catch (error: any) {
        toast.error(error.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer theme='light' />
      <div className={styles.searchContainer}>
        <h1>Consulta de CNPJ</h1>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Digite o CNPJ"
            value={cnpj}
            onChange={handleCnpjChange}
          />
          <button onClick={handleSearch}>Consultar</button>
        </div>
      </div>

      {companyData && (
        <div className={styles.dataContainer}>
          <h2>Informações da Empresa</h2>
          <div className={styles.editButton}>
            <div className={styles.button} onClick={toggleEdit}>
              {isEditing ? <img src='/assets/icons/save.png' width={24} height={24} /> : <img src='/assets/icons/edit.png' width={24} height={24} />}
            </div>
          </div>
          <div className={styles.infoContainer}>
            <label>
              Nome:
              <input
                type="text"
                value={companyData.nome_fantasia}
                onChange={(e) => handleInputChange(e, 'nome_fantasia')}
                readOnly={!isEditing}
              />
            </label>
            <label>
              Razão Social:
              <input
                type="text"
                value={companyData.razao_social}
                onChange={(e) => handleInputChange(e, 'razao_social')}
                readOnly={!isEditing}
              />
            </label>
            <label>
              Data de Abertura:
              <input
                type="text"
                value={companyData.data_inicio_atividade}
                onChange={(e) => handleInputChange(e, 'data_inicio_atividade')}
                readOnly={!isEditing}
              />
            </label>
            <label>
              Situação:
              <input
                type="text"
                value={companyData.descricao_situacao_cadastral}
                onChange={(e) => handleInputChange(e, 'descricao_situacao_cadastral')}
                readOnly={!isEditing}
              />
            </label>
            <label>
              Atividade Principal:
              <input
                type="text"
                value={companyData.cnae_fiscal_descricao}
                onChange={(e) => handleInputChange(e, 'cnae_fiscal_descricao')}
                readOnly={!isEditing}
              />
            </label>
            <label>
              Endereço Completo:
              <input
                type="text"
                value={`${companyData.logradouro}, ${companyData.numero} - ${companyData.bairro}, ${companyData.municipio} - ${companyData.uf}`}
                readOnly
              />
            </label>
            <label>
              Telefone:
              <input
                type="text"
                value={companyData.ddd_telefone_1 || ''}
                onChange={(e) => handleInputChange(e, 'ddd_telefone_1')}
                readOnly={!isEditing}
              />
            </label>
          </div>
          
          <h2>Quadro Societário</h2>
          <div className="qsaContainer">
            {companyData.qsa.map((socio, index) => (
              <div key={index} className="qsa-card">
                <label>
                  Nome do Sócio:
                  <input
                    type="text"
                    value={socio.nome_socio}
                    readOnly={!isEditing}
                  />
                </label>
                <label>
                  CPF/CNPJ:
                  <input
                    type="text"
                    value={socio.cnpj_cpf_do_socio}
                    readOnly={!isEditing}
                  />
                </label>
                <label>
                  Qualificação:
                  <input
                    type="text"
                    value={socio.codigo_qualificacao_socio.toString()}
                    readOnly={!isEditing}
                  />
                </label>
                <label>
                  Percentual do Capital Social:
                  <input
                    type="text"
                    value={socio.percentual_capital_social !== undefined && socio.percentual_capital_social !== null ? socio.percentual_capital_social.toString() : ''}
                    readOnly={!isEditing}
                  />
                </label>
              </div>
            ))}
          </div>
            <div className={styles.submitButton}>
              <button onClick={handleSubmit}>Submeter</button>
            </div>
        </div>
      )}
    </div>
  );
}

interface CnpjResponseDto {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  data_inicio_atividade: string;
  descricao_situacao_cadastral: string;
  cnae_fiscal_descricao: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  ddd_telefone_1: string | null;
  qsa: {
    identificador_de_socio: number;
    nome_socio: string;
    cnpj_cpf_do_socio: string;
    codigo_qualificacao_socio: number;
    percentual_capital_social: number;
    data_entrada_sociedade: string;
    cpf_representante_legal: string | null;
    nome_representante_legal: string | null;
    codigo_qualificacao_representante_legal: number | null;
  }[];
}
# **Projeto de Consulta de CNPJ**

## **Descrição**
Este projeto consiste em uma aplicação para consulta de CNPJ utilizando a API da BrasilAPI. A aplicação permite que o usuário insira um CNPJ, realize a consulta e visualize as principais informações da empresa, incluindo o quadro societário. A interface é responsiva e os dados apresentados podem ser editados diretamente, com a opção de submeter as alterações.

## **Estrutura de Arquivos**
```bash
|-- src/
|   |-- app/
|       |-- consultar/
|           |-- page.tsx  # Componente principal da página de consulta
|           |-- styles.module.css  # Estilos específicos da página de consulta
|-- lib/
|   |-- dto/
|       |-- CnpjResponseDto.ts  # Definição dos tipos para os dados da resposta da API
|-- public/
|   |-- assets/
|       |-- icons/
|           |-- edit.png  # Ícone de edição
|           |-- save.png  # Ícone de salvar
|-- README.md  # Instruções para rodar o projeto
```

## **Instalação e Execução**
1. Clone o repositório:
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd nome-do-repositorio
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Execute o projeto:
    ```bash
    npm run dev
    ```

4. Acesse a aplicação no navegador:
    ```
    http://localhost:3000
    ```

## **Código Fonte**

### **`ConsultarPage` Componente**
Este é o componente principal que gerencia a página de consulta de CNPJ.

```tsx
"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";
import { CnpjResponseDto } from "@/lib/dto/CnpjResponseDto";

export default function ConsultarPage() {
  // Estado para armazenar o valor do CNPJ digitado pelo usuário
  const [cnpj, setCnpj] = useState("");
  
  // Estado para armazenar os dados da empresa retornados pela API
  const [companyData, setCompanyData] = useState<CnpjResponseDto | null>(null);
  
  // Estado para controlar o modo de edição
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Manipula a mudança de valor no campo de input do CNPJ
   */
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpj(e.target.value);
  };

  /**
   * Formata o CNPJ removendo qualquer caractere não numérico
   * @param cnpj - O CNPJ em formato de string
   * @returns O CNPJ formatado apenas com números
   */
  const formatCnpj = (cnpj: string) => {
    return cnpj.replace(/\D/g, "");
  };

  /**
   * Realiza a busca dos dados da empresa com base no CNPJ fornecido
   */
  const handleSearch = async () => {
    try {
      const formattedCnpj = formatCnpj(cnpj);
      if (formattedCnpj.length !== 14) {
        toast.error("CNPJ inválido. Por favor, insira um CNPJ válido.");
        return;
      }

      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${formattedCnpj}`
      );
      if (!response.ok) {
        throw new Error(
          "Erro ao buscar informações. Verifique o CNPJ e tente novamente."
        );
      }

      const data: CnpjResponseDto = await response.json();
      setCompanyData(data);
      toast.success("Consulta realizada com sucesso!");
    } catch (error: any) {
      toast.error(
        error.message ||
          "Ocorreu um erro inesperado. Tente novamente mais tarde."
      );
    }
  };

  /**
   * Alterna o estado de edição dos dados
   */
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  /**
   * Manipula a mudança de valor nos campos de input dos dados da empresa
   * @param e - Evento de mudança no campo de input
   * @param field - Campo específico a ser atualizado
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CnpjResponseDto
  ) => {
    if (companyData) {
      setCompanyData({
        ...companyData,
        [field]: e.target.value,
      });
    }
  };

  /**
   * Simula a submissão dos dados da empresa editados
   */
  const handleSubmit = async () => {
    if (companyData) {
      try {
        // Simula a submissão dos dados (troque a URL pela de sua API de submissão real)
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyData),
        });

        if (!response.ok) {
          throw new Error("Erro ao submeter os dados. Tente novamente.");
        }

        toast.success("Dados submetidos com sucesso!");
        setIsEditing(false);
      } catch (error: any) {
        toast.error(
          error.message ||
            "Ocorreu um erro inesperado. Tente novamente mais tarde."
        );
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer theme="light" />
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
              {isEditing ? (
                <img src="/assets/icons/save.png" width={24} height={24} />
              ) : (
                <img src="/assets/icons/edit.png" width={24} height={24} />
              )}
            </div>
          </div>
          <div className={styles.infoContainer}>
            <label>
              Nome:
              <input
                type="text"
                value={companyData.nome_fantasia}
                onChange={(e) => handleInputChange(e, "nome_fantasia")}
                readOnly={!isEditing}
              />
            </label>
            <label>
              Razão Social:
              <input
                type="text"
                value={companyData.razao_social}
                onChange={(e) => handleInputChange(e, "razao_social")}
                readOnly={!isEditing}
              />
            </label>
            <label>
              Data de Abertura:
              <input
                type="text"
                value={companyData.data_inicio_atividade}
                onChange={(e) => handleInputChange(e, "data_inicio_atividade")}
                readOnly={!isEditing}
              />
            </label>
            <label>
              Situação:
              <input
                type="text"
                value={companyData.descricao_situacao_cadastral}
                onChange={(e) =>
                  handleInputChange(e, "descricao_situacao_cadastral")
                }
                readOnly={!isEditing}
              />
            </label>
            <label>
              Atividade Principal:
              <input
                type="text"
                value={companyData.cnae_fiscal_descricao}
                onChange={(e) => handleInputChange(e, "cnae_fiscal_descricao")}
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
                value={companyData.ddd_telefone_1 || ""}
                onChange={(e) => handleInputChange(e, "ddd_telefone_1")}
                readOnly={!isEditing}
              />
            </label>
          </div>

          <h2>Quadro Societário</h2>
          <div className={styles.infoContainer}>
            {companyData.qsa.map((socio, index) => (
              <div key={index} className={styles.qsaCard}>
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
                    value={socio.codigo_qualificacao_socio

}
                    readOnly={!isEditing}
                  />
                </label>
              </div>
            ))}
          </div>
          {isEditing && (
            <button onClick={handleSubmit}>Salvar Alterações</button>
          )}
        </div>
      )}
    </div>
  );
}
```

## **Considerações Finais**
O código é organizado e modular, utilizando boas práticas de programação, como a separação de responsabilidades e o uso de TypeScript para tipagem. O uso de notificações com `react-toastify` melhora a experiência do usuário, fornecendo feedback imediato sobre as ações realizadas.
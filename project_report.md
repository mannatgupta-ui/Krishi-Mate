# Project Report: Krishi-Mate

## 1. ABSTRACT

### Project Overview
Agriculture is increasingly shifting toward data-driven decision-making to enhance productivity, economic planning, and food security. **Krishi-Mate** is developed as a holistic Smart Farming platform that integrates advanced Machine Learning, Deep Learning, and Real-time Analytics to provide actionable intelligence to farmers and stakeholders. This project consolidates five critical modules into a unified ecosystem:

#### 1. Crop Yield Prediction Module
*   **Objective**: To provide reliable pre-harvest yield estimates using historical agricultural data.
*   **Algorithm**: A **Random Forest Regressor** was trained using the verified **APY.csv** (Agricultural Production and Yield) dataset sourced from official government records.
*   **Feature Analysis**: The model analyses high-dimensional interactions between **State, District, Season, Crop Type, and Cultivation Area**.
*   **Target Engineering**: Yield was engineered as the ratio of Total Production to Cultivation Area to normalize the target variable and improve model stability.
*   **Performance**: Comprehensive preprocessing (encoding, normalization, cleaning) resulted in a strong **R² score of approximately 0.88**, demonstrating high robustness against noisy real-world data.

#### 2. Intelligent Crop Recommendation System
*   **Objective**: To suggest the most economically and biologically viable crops for specific land conditions.
*   **Integration**: Incorporates **NPK (Nitrogen, Phosphorus, Potassium)** values, soil pH, and local climatic conditions (Temperature, Humidity, Rainfall).
*   **Impact**: Optimizes resource usage and minimizes crop failure risks by matching soil profiles with ideal crop requirements.

#### 3. Plant Disease Detection System
*   **Objective**: Early diagnosis of crop pathologies to prevent widespread yield loss.
*   **Technology**: Utilizes state-of-the-art **Convolutional Neural Networks (CNNs)**, including **EfficientNetV2** and **ResNet50** architectures.
*   **Functionality**: Enables real-time image analysis of plant leaves to detect diseases such as Blight, Rust, and Spot with high confidence scores.

#### 4. Market Intelligence & Pricing
*   **Objective**: To empower farmers with financial transparency and market awareness.
*   **Real-time Data**: Integrates the **AgMarkNet API** to fetch live Mandi prices and market trends for various crops across different Indian markets.
*   **Benefit**: Aids in logistics planning and determining the optimal time for selling produce.

#### 5. AI-Powered Agronomy Assistant (Chatbot)
*   **Objective**: To provide instant, natural language support for farming queries.
*   **Architecture**: Built on a **RAG (Retrieval-Augmented Generation)** framework using a vectorized knowledge base (`enhanced_knowledge_base.txt`) and FAISS indexing.
*   **Capabilities**: Answers questions regarding government schemes, farming techniques, and pest control in a conversational manner.

### Technical Implementation & Deployment
*   **Backend**: The entire suite of models is serialized and deployed via a high-performance **FastAPI** backend, enabling millisecond-latency inference and concurrent request handling.
*   **Frontend**: A modern, interactive **React-based dashboard** serves as the user interface, featuring dependent dropdowns for valid input selection, dynamic charts for data visualization, and a responsive design.
*   **Scalability**: The modular architecture allows for seamless future integrations of IoT sensor data and satellite imagery.

### Conclusion & Strategic Vision
This unified platform significantly enhances situational awareness for farmers, bridging the gap between raw data and actionable insights. By enabling data-informed governance and promoting responsible technology adoption, Krishi-Mate aligns with the vision of **Viksit Bharat 2047**, contributing to a technologically advanced and self-reliant agricultural sector.

class HeartDiseasePredictor {
    constructor() {
        this.apiBaseUrl = 'https://heartdiseasepredictorbackend.onrender.com';
        //  this.apiBaseUrl = window.location.hostname === 'localhost' 
        //     ? 'http://localhost:5000' 
        //     : 'https://your-app-name.onrender.com'; 
        
        this.init();
        // this.initializeEventListeners();
        // this.loadSampleData();
    }
       init() {
        console.log(' Heart Disease Predictor Initializing...');
        this.initializeEventListeners();
        this.testConnection();
        // this.loadSampleData();
    }

    initializeEventListeners() {
        const form = document.getElementById('predictionForm');
        form.addEventListener('submit', (e) => this.handlePrediction(e));
      }
          async testConnection() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            console.log(' API Connected:', data);
        } catch (error) {
            console.error(' API Connection failed');
        }
    }
    // loadSampleData() {
    //     // Pre-fill with sample data for testing
    //     document.getElementById('age').value = 52;
    //     document.getElementById('sex').value = '1';
    //     document.getElementById('cp').value = '2';
    //     document.getElementById('trestbps').value = 128;
    //     document.getElementById('chol').value = 205;
    //     document.getElementById('fbs').value = '1';
    //     document.getElementById('restecg').value = '1';
    //     document.getElementById('thalach').value = 142;
    //     document.getElementById('exang').value = '0';
    //     document.getElementById('oldpeak').value = '1.2';
    //     document.getElementById('slope').value = '2';
    //     document.getElementById('ca').value = '0';
    //     document.getElementById('thal').value = '2';
    // }
      async testConnection() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            console.log('✅ API Connected:', data);
        } catch (error) {
            console.error('❌ API Connection failed');
        }
    }
     async handlePrediction(event) {
        event.preventDefault();
        
        // Show loading state
        this.showLoading();
                try {
            const formData = this.getFormData();
            const prediction = await this.makePrediction(formData);
            this.displayResults(prediction);
        } catch (error) {
            this.showError(error.message);
        }
    }

        getFormData() {
              
   const data =  {
            age: parseInt(document.getElementById('age')?.value || 0),
            sex: parseInt(document.getElementById('sex')?.value || 0),
            cp: parseInt(document.getElementById('cp')?.value || 0),
            trestbps: parseInt(document.getElementById('trestbps')?.value || 0),
            chol: parseInt(document.getElementById('chol')?.value || 0),
            fbs: parseInt(document.getElementById('fbs')?.value || 0 ),
            restecg: parseInt(document.getElementById('restecg')?.value || 0),
            thalach: parseInt(document.getElementById('thalach')?.value || 0 ),
            exang: parseInt(document.getElementById('exang')?.value || 0 ),
            oldpeak: parseFloat(document.getElementById('oldpeak')?.value || 0),
            slope: parseInt(document.getElementById('slope')?.value || 0),
            ca: parseInt(document.getElementById('ca')?.value || 0),
            thal: parseInt(document.getElementById('thal')?.value || 0 )
        };
         console.log('📝 Form data collected:', data);
        return data;

    }

        async makePrediction(formData) {
        const response = await fetch(`${this.apiBaseUrl}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
         if (!response.ok) {
            throw new Error('Prediction request failed');
        }
            const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Prediction failed');
        }

        return result;
    }

        displayResults(prediction) {
        // Hide welcome card and show results
        document.getElementById('welcomeCard').classList.add('hidden');
        document.getElementById('resultsPanel').classList.remove('hidden');
           // Update risk percentage and circle
        const percentage = Math.round(prediction.probability * 100);
        document.getElementById('riskPercentage').textContent = `${percentage}%`;

            // Update risk level and color
        const riskLevel = prediction.risk_level;
        document.getElementById('riskLevel').textContent = `${riskLevel} Risk`;

        const riskCircle = document.getElementById('riskCircle');
        riskCircle.className = `w-32 h-32 rounded-full border-8 flex items-center justify-center mx-auto pulse-ring risk-${riskLevel.toLowerCase()}`;

         // Update explanation
        document.getElementById('explanationText').textContent = prediction.explanation;

        // Update recommendations
        this.displayRecommendations(prediction);
                // Display feature importance
        this.displayFeatureImportance(prediction.feature_importance);
    }

    displayRecommendations(prediction) {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
      
        const recommendations = this.generateRecommendations(prediction);

       recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            li.className = 'text-blue-600 text-sm';
            recommendationsList.appendChild(li);
        });
    }
    
    generateRecommendations(prediction) {
        const recommendations = [];
        const probability = prediction.probability;

     if (probability > 0.6) {
            recommendations.push('Consult a cardiologist for comprehensive evaluation');
             recommendations.push('Consider stress testing and advanced cardiac screening');
            recommendations.push('Monitor blood pressure and cholesterol regularly');
          } else if (probability > 0.3) {
            recommendations.push('Schedule regular health check-ups with your doctor');
            recommendations.push('Adopt heart-healthy diet and exercise routine');
             recommendations.push('Monitor key risk factors like blood pressure');
             } else {
            recommendations.push('Maintain current healthy lifestyle habits');
             recommendations.push('Continue regular physical activity');
            recommendations.push('Schedule annual health screenings');  
            }

        recommendations.push('Avoid smoking and limit alcohol consumption');
        recommendations.push('Manage stress through relaxation techniques');
        recommendations.push('Maintain healthy body weight');

        return recommendations;  

    }
    displayFeatureImportance(importance) {
        const container = document.getElementById('featureImportance');
        const chart = document.getElementById('importanceChart');
        chart.innerHTML = '';
        container.classList.remove('hidden');

        const features = Object.entries(importance)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5 features

        features.forEach(([feature, score]) => {
            const featureDiv = document.createElement('div');
            featureDiv.className = 'flex items-center justify-between';
            
         const featureName = document.createElement('span');
            featureName.className = 'text-sm text-gray-600';
            featureName.textContent = this.formatFeatureName(feature);  
            
            const barContainer = document.createElement('div');
            barContainer.className = 'w-24 bg-gray-200 rounded-full h-2';

            const bar = document.createElement('div');
            bar.className = 'bg-blue-500 h-2 rounded-full';
            bar.style.width = `${score * 100}%`;

            barContainer.appendChild(bar);
            featureDiv.appendChild(featureName);
            featureDiv.appendChild(barContainer);

            chart.appendChild(featureDiv);
        });
    }

    formatFeatureName(feature) {
        const names = {
            'age': 'Age',
            'sex': 'Sex',
            'cp': 'Chest Pain',
            'trestbps': 'Blood Pressure',
            'chol': 'Cholesterol',
            'fbs': 'Blood Sugar',
            'restecg': 'Resting ECG',
            'thalach': 'Max Heart Rate',
            'exang': 'Exercise Angina',
            'oldpeak': 'ST Depression',
            'slope': 'ST Slope',
            'ca': 'Major Vessels',
            'thal': 'Thalassemia'
        };
        return names[feature] || feature;
    }

    showLoading() {
        //  a loading spinner 
        const button = document.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Analyzing...';
        button.disabled = true;
         button.setAttribute('data-original-text', originalText);
    }
    hideLoading() {
        const button = document.querySelector('button[type="submit"]');
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
        }
        button.disabled = false;
    }
    showError(message) {
        this.hideLoading();
      // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
            </div>
        `; 
         document.body.appendChild(errorDiv);
         setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }  

}

// Feature descriptions tooltip
function setupFeatureTooltips() {
    const features = {
        'age': 'Age in years',
        'sex': 'Biological sex (0: Female, 1: Male)',
        'cp': 'Type of chest pain experienced',
        'trestbps': 'Resting blood pressure measurement in mm Hg',
        'chol': 'Serum cholesterol level in mg/dL',
        'fbs': 'Fasting blood sugar above 120 mg/dL',
        'restecg': 'Resting electrocardiographic results',
        'thalach': 'Maximum heart rate achieved during exercise',
        'exang': 'Exercise induced chest pain',
        'oldpeak': 'ST depression induced by exercise relative to rest',
        'slope': 'Slope of the peak exercise ST segment',
        'ca': 'Number of major vessels colored by fluoroscopy',
        'thal': 'Thalassemia blood disorder results'
    };

    // You can implement tooltips for each input field
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeartDiseasePredictor();
    setupFeatureTooltips();
});


// Service worker for offline functionality (optional)
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//          .then(registration => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch(registrationError => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//             });
// }

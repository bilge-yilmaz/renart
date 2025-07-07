# 🚀 BACKEND HEROKU DEPLOYMENT

## ⚡ HIZLI DEPLOYMENT (5 dakika)

### 1. Backend Klasörüne Git
```bash
cd backend
```

### 2. Git Repository Oluştur
```bash
# Git repo başlat
git init

# Dosyaları ekle
git add .
git commit -m "Backend ready for Heroku"
```

### 3. Heroku'ya Deploy Et
```bash
# Heroku'ya login
heroku login

# Yeni Heroku app oluştur
heroku create renart-backend-api

# Deploy et
git push heroku main
```

### 4. Heroku URL'i Al
Deploy sonrası şu tarzda bir URL alacaksın:
```
https://renart-backend-api.herokuapp.com
```

### 5. Frontend'i Backend'e Bağla
**frontend/.env.production** dosyasını güncelle:
```env
REACT_APP_API_URL=https://renart-backend-api.herokuapp.com
```

### 6. Frontend'i Tekrar Deploy Et
```bash
# Ana klasöre geri dön
cd ..

# Vercel'e tekrar deploy et
vercel --prod
```

## 🎉 SONUÇ

- **Backend API**: https://renart-backend-api.herokuapp.com
- **Frontend**: https://your-app.vercel.app
- **API Test**: https://renart-backend-api.herokuapp.com/api/health

## 🔧 TEST KOMUTLARI

```bash
# Backend'i local test et
cd backend
npm start

# API test et
curl https://renart-backend-api.herokuapp.com/api/health
curl https://renart-backend-api.herokuapp.com/api/products
```

## 📝 ÖNEMLİ NOTLAR

1. **Backend**: Sadece API endpoints serve ediyor
2. **CORS**: Vercel domain'leri için configured
3. **Products**: backend/products.json'dan okuyuyor
4. **Port**: Heroku otomatik assign ediyor
5. **SSL**: Otomatik HTTPS

## 🆘 SORUN GİDERME

```bash
# Heroku logs
heroku logs --tail -a renart-backend-api

# Heroku restart
heroku restart -a renart-backend-api

# Heroku config
heroku config -a renart-backend-api
``` 
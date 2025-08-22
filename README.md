# OneDay OneProblem - Algorithm Practice Platform

A modern web application for practicing algorithms with real-time code execution, performance monitoring, and comprehensive analytics.

## 🚀 Features

### Core Functionality

- **Real-time Code Execution**: Execute algorithms in a secure sandboxed environment
- **Problem Management**: Create and manage algorithm problems with test cases
- **User Progress Tracking**: Monitor user progress and solved problems
- **Performance Analytics**: Comprehensive performance monitoring and analytics

### Performance Monitoring System

- **Real-time Metrics**: Track response times, error rates, and system health
- **Health Checks**: Automated system health monitoring with alerts
- **External Integration**: Export metrics to Prometheus, DataDog, and other monitoring systems
- **Performance Dashboard**: Real-time visualization of system performance
- **Alerting**: Automatic detection of performance issues and anomalies

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Performance Monitoring**: Custom real-time monitoring system
- **Testing**: Vitest, React Testing Library
- **Code Quality**: ESLint, Prettier

## 📊 Performance Monitoring

### Real-time Metrics

The application includes a comprehensive performance monitoring system that tracks:

- **Response Times**: Average, P95, P99 percentiles
- **Error Rates**: Real-time error tracking and alerting
- **System Health**: Automated health checks and status monitoring
- **Operation Analytics**: Per-operation performance metrics
- **User Analytics**: Performance patterns by user and client

### Health Check Endpoint

```bash
# Check system health
curl -I http://localhost:3000/api/performance

# Response headers include:
# X-Health-Status: healthy/unhealthy
# X-Error-Rate: 0.0234
# X-Avg-Response-Time: 150
# X-Total-Operations: 1234
```

### Metrics Export

```bash
# Export metrics in JSON format
curl -X PATCH http://localhost:3000/api/performance

# Export metrics in Prometheus format
curl -X PATCH "http://localhost:3000/api/performance?format=prometheus"
```

### Performance Dashboard

Access the real-time performance dashboard at `/performance` to view:

- System health status
- Real-time performance metrics
- Operation-specific analytics
- Error rate monitoring
- Response time trends

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd oneday-oneproblem
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following environment variables:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Performance Monitoring (Optional)
   ENABLE_PERFORMANCE_MONITORING=true
   PERFORMANCE_ALERT_THRESHOLD=1000
   ```

4. **Database Setup**

   ```bash
   # The application will automatically create necessary collections
   # Ensure MongoDB is running and accessible
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

## 🧪 Testing

### Run All Tests

```bash
pnpm test:run
```

### Run Tests with UI

```bash
pnpm test:ui
```

### Test Coverage

The application includes comprehensive tests for:

- API endpoints
- Performance monitoring system
- Database operations
- Rate limiting
- Error handling

## 📈 Production Deployment

### Performance Monitoring Setup

1. **Enable Performance Monitoring**

   ```env
   ENABLE_PERFORMANCE_MONITORING=true
   ```

2. **Configure External Monitoring**

   ```bash
   # Prometheus configuration example
   - job_name: 'oneday-oneproblem'
     static_configs:
       - targets: ['localhost:3000']
     metrics_path: '/api/performance'
     params:
       format: ['prometheus']
   ```

3. **Health Check Integration**
   ```bash
   # Load balancer health check
   health_check:
     path: /api/performance
     method: HEAD
     expected_status: 200
   ```

### Security Considerations

1. **Rate Limiting**: All API endpoints include rate limiting
2. **Input Validation**: Comprehensive input validation with Zod
3. **Code Execution**: Sandboxed code execution with security restrictions
4. **Authentication**: Secure authentication with NextAuth.js
5. **File Upload**: Secure file upload with validation and sanitization

### Performance Optimization

1. **Database Indexing**: Optimized database queries with proper indexing
2. **Caching**: Strategic caching for static data
3. **Connection Pooling**: Efficient database connection management
4. **Error Boundaries**: Graceful error handling and recovery
5. **Monitoring**: Real-time performance monitoring and alerting

## 🔍 API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### User Management

- `GET /api/user` - Get user profile
- `POST /api/user` - Create user
- `PUT /api/user` - Update user profile

### Problem Management

- `GET /api/algorithms` - Get all algorithms
- `POST /api/algorithms` - Create algorithms
- `PUT /api/algorithms` - Update algorithm
- `DELETE /api/algorithms` - Delete all algorithms

### Code Execution

- `POST /api/executeCode` - Execute user code (fallback)
- `POST /api/analyzeCode` - Analyze code with AI feedback

### Performance Monitoring

- `GET /api/performance` - Get performance statistics
- `HEAD /api/performance` - Health check
- `PATCH /api/performance` - Export metrics
- `DELETE /api/performance` - Reset metrics

## 🚨 Monitoring and Alerting

### Health Check Alerts

The system automatically detects and alerts on:

- High error rates (>5% critical, >2% warning)
- Slow response times (>2s critical, >1s warning)
- High number of slow operations (>10% of total)

### Performance Metrics

Track these key metrics in production:

- **Response Time**: Target <500ms average, <1s P95
- **Error Rate**: Target <1% error rate
- **Throughput**: Monitor requests per second
- **System Health**: Ensure 99.9% uptime

### External Monitoring Integration

The application supports integration with:

- **Prometheus**: Native Prometheus metrics export
- **DataDog**: JSON metrics format
- **Grafana**: Compatible metrics format
- **Custom Monitoring**: Flexible JSON export

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the performance dashboard for system status
- Review the API documentation

---

**Built with ❤️ for the developer community**

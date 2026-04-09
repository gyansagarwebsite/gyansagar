import dns from 'dns';

console.log('🚀 Setting up custom DNS for MongoDB SRV...');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

console.log('✅ Google DNS + Cloudflare active for SRV resolution');
console.log('Test SRV: node -e "require(\'dns\').resolveSrv(\'_mongodb._tcp.gyansagar.cbjzxl5.mongodb.net\', console.log)"');


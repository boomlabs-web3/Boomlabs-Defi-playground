## v2-periphery

### Contract Address 
- RouterV2 Address : 0x664b0296D9d640C8a7CC1A3AbfEa4904962a3904
- WETH Address : 0x54eea9738C4f1A42e3995b48d3855474917b87aA
- DAI-wMATIC pair : 0x912B9Ce075fc0952c08070B0ddC2040632A5dd74

### Usage
- `npm install`
- 배포는 scripts/deploy.js 참고(periphery 컨트랙트 배포 전에 core 컨트랙트 배포 필요)
- RouterV2 컨트랙트 배포 시 배포했던 Factory 컨트랙트의 INIT_CODE_PAIR_HASH를 UniswapV2Library 파일의 pairFor 함수 내에서 사용(Hash 교체)
- .env 파일 생성해서 Mumbai RPC Url, PRIVATE KEY 채워넣기
- RouterV2.addLiquidity로 유동성 공급
- RouterV2.swapExactTokensForTokens로 token to token 스왑

import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { OtpService } from 'src/otp/otp.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { JwtAuthGuard } from 'src/jwt/jwt_auth_guard';

//@UseGuards(FTAuthGuard)
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
    private optService: OtpService,
  ) {}

  // @Get()
  // async AuthLogic(@Req() req: any, @Res() res: Response) {
  //   //let redirectURL = 'http://localhost:3001/'; //main page url
  //   let redirectURL = this.configService.get<string>('FRONTEND_URL'); //main page url

  //   //42 Resource 서버에 인트라 아이디 정보 요청

  //   //const accessToken: string = req.user;
  //   const authorizationCode = req.query.code;

  //   //42 Resource 서버에서 인증된 AccessToken값 응답 확인
  //   //console.log('req.user: ', req.user);
  //   const accessToken = await this.authService.getAccessToken(
  //     authorizationCode,
  //   );
  //   //42 Server에 client & AccessToken을 사용하여 API 호출
  //   const intraData = await this.authService.getIntraData(accessToken);

  //   //client intraID를 DB 조회
  //   let result = await this.userService.findUser(intraData['login']);
  //   let firstFlag = false;
  //   if (result == null) {
  //     //신규 생성
  //     result = await this.userService.createUser(
  //       intraData['login'],
  //       intraData['email'],
  //       intraData['image']['link'],
  //     );
  //     firstFlag = true;
  //   }

  //   //세션 중복 확인
  //   // 이미 해당 세션에 대한 데이터가 존재할 경우, 진행을 거부한다.
  //   const storedSession = this.userService.getSession(intraData['login']);
  //   console.log('storedSession: ', storedSession);
  //   if (storedSession != undefined) {
  //     throw new NotAcceptableException('Session already connected');
  //   }

  //   //otp 미 사용자 처리
  //   if (result.isotp == false) {
  //     //세션 키 생성 및 저장
  //     const sessionData = this.userService.createSession(intraData['login']);
  //     //for debug
  //     console.log(`otp 미 사용자 세션 생성`);
  //     console.log(`create session Key: ${sessionData.key}`);
  //     console.log(`create session User : ${sessionData.name}`);
  //     //쿠키 값 전달
  //     res.cookie('session_key', sessionData.key);
  //     res.cookie('nickname', result.intraid);
  //     res.cookie('userData', JSON.stringify(result));
  //     //리디렉션 join 설정 asdasdfasdfa
  //     //if (firstFlag == true) redirectURL = 'http://localhost:3001/join';
  //     if (firstFlag == true)
  //       redirectURL = `${this.configService.get('FRONTEND_URL')}/join`;
  //   } else {
  //     //for debug
  //     console.log(`otp 사용자 세션 미 생성`);
  //     console.log(`이메일 발송`);
  //     //기존 Otp 키 삭제
  //     this.optService.deleteOptKey(this.optService.getOptKey(result.intraid));

  //     //Otp 키 생성
  //     const optKey = this.optService.createOptKey(result.intraid);

  //     //이메일 Otp 키 전송
  //     await this.mailService.sendEmail(result.email, optKey);

  //     //email 쿠키 값 설정
  //     res.cookie('email', result.email);

  //     //리디렉션 otp 설정
  //     //redirectURL = 'http://localhost:3001/otp';
  //     redirectURL = `${this.configService.get('FRONTEND_URL')}/otp`;
  //   }
  //   res.redirect(redirectURL);
  //   return;
  // }

  @Get('/login')
  login(@Res() res: Response) {
    // Redirect users to the OAuth2 provider's authorization page
    const authorizationURL = `https://api.intra.42.fr/oauth/authorize?client_id=${this.configService.get<string>(
      'CLIENT_UID',
    )}&redirect_uri=${this.configService.get<string>(
      'REDIRECT_URL',
    )}&response_type=code`;
    res.redirect(authorizationURL);
  }

  @Get('kakao')
  async kakao(@Req() req: any, @Res() res: any) {
    const kakaoToken = "some_token";

    // Request user information from Kakao using the accessToken
    const me = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoToken}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    // me라는 카카오회원의 정보가 db에 등록되어 있는지에 따라 회원가입, 로그인 로직이 갈린다.

    // custom token 발급
    const jwtToken = await this.authService.generateToken({ foo:'bar', admin:'gshim' });
    const isMobileClient = req.headers['user-agent'].includes('Mobile'); // or any better method to determine client type
    if (isMobileClient) {
      res.json({ jwtToken });
      console.log('kakao login success ✅');
    } else {
      res.cookie('jwtToken', JSON.stringify({ jwtToken }), { httpOnly: true });
      res.send('kakao login success ✅');
    }
  }

  @Post('naver')
  async customTokenByNaver(@Req() req: any, @Res() res: any) {
    const { naver_access_token } = req.body;
    console.log('naver_access_token:[', naver_access_token, ']');

    if (!naver_access_token) {
      console.log('토큰이 없쪙..🥹');
      res.send('토큰이 없쪙..🥹');
      return;
    }

    const apiURL = 'https://openapi.naver.com/v1/nid/me';

    try {
      const response: AxiosResponse = await axios.get(apiURL, {
        headers: {
          'Authorization': `Bearer ${naver_access_token}`,
        },
      });

      // custom token 발급
      const jwtToken = await this.authService.generateToken({
        id: response.data.response.id,
        email: response.data.response.email,
      });
      console.log('esponse.data.response: ', response.data.response);
      console.log('jwtToken:', jwtToken);
      console.log('isMobile:', req.headers['user-agent']); // Dart/3.0 (dart:io)
      const isMobileClient = req.headers['user-agent'].includes('Mobile'); // or any better method to determine client type
      if (isMobileClient) { // not work 🥹
        res.json({ jwtToken });
        console.log('kakao login success ✅✅');
      } else {
        //res.cookie('jwtToken', JSON.stringify({ jwtToken }), { httpOnly: true });
        console.log('jwtToken:', jwtToken);
        res.json({ jwtToken });
        //res.send('kakao login success ✅');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.log(axiosError.response?.data);
      } else {
        console.error((error as Error).message);
      }
      res.send(error);
    }
  };

  @Post('kakao')
  async customTokenByKakao(@Req() req: any, @Res() res: any) {
    const { kakao_access_token } = req.body;
    console.log('kakao_access_token:[', kakao_access_token, ']');

    if (!kakao_access_token) {
      console.log('토큰이 없쪙..🥹');
      res.send('토큰이 없쪙..🥹');
      return;
    }

    try {
      // Request user information from Kakao using the accessToken
      const me = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${kakao_access_token}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      // custom token 발급
      const jwtToken = await this.authService.generateToken({
        id: me.data.response.id,
        email: me.data.response.email,
      });
      console.log('response.data: ', me.data);
      console.log('jwtToken:', jwtToken);

      //console.log('isMobile:', req.headers['user-agent']); // Dart/3.0 (dart:io)
      // const isMobileClient = req.headers['user-agent'].includes('Mobile'); // or any better method to determine client type
      // if (isMobileClient) { // not work 🥹
      //   res.json({ jwtToken });
      //   console.log('kakao login success ✅✅');
      // } else {
      //   //res.cookie('jwtToken', JSON.stringify({ jwtToken }), { httpOnly: true });
      //   console.log('jwtToken:', jwtToken);
      //   res.json({ jwtToken });
      //   //res.send('kakao login success ✅');
      // }
      res.json({ jwtToken });
      res.send('kakao login success ✅');

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.log(axiosError.response?.data);
      } else {
        console.error((error as Error).message);
      }
      res.send(error);
    }
  };

  @UseGuards(JwtAuthGuard)
  @Get('naver_test')
  todaysFood(@Req() req: any, @Res() res: any) {
    console.log('req.rawHeaders:',req.rawHeaders);
    res.send('당신은 로그인에 성공했군요! 🍟');
  }
}

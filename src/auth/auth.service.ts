import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async getIntraData(accessToken: string): Promise<any> {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      const response = await axios.get('https://api.intra.42.fr/v2/me', config);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAccessToken(authorizationCode: string): Promise<string> {
    try {
      const response = await axios.post(
        this.configService.get<string>('TOKEN_URL'),
        {
          client_id: this.configService.get<string>('CLIENT_UID'),
          client_secret: this.configService.get<string>('CLIENT_SECRET'),
          code: authorizationCode,
          grant_type: 'authorization_code',
          redirect_uri: this.configService.get<string>('REDIRECT_URL'),
        },
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }
}

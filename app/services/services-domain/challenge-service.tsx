import { ErrorResponseDto } from "../../dto/ErrorResponseDto";
import HotPocketClientService from "./../hp-client-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class ChallengeService {

    private constructor() {
    }

    public static getInstance(): ChallengeService {
        return new ChallengeService();
    }

    public async getChallngesByUser() {
        const messageService = 'Challenge';
        const messageAction = 'GetChallngesByUser';

        const message = {
            Service: messageService,
            Action: messageAction,
            Auth: {
                sessionId: (await AsyncStorage.getItem("sessionId")).replace(/['"]/g, '')
            }
        }

        try {
            const response: any = await HotPocketClientService.submitContractReadRequest(message);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async getChallengeDetailsByUser(challengeId: number) {
        const messageService = 'Challenge';
        const messageAction = 'GetChallengeDetailsByUser';

        const message = {
            Service: messageService,
            Action: messageAction,
            Auth: {
                sessionId: (await AsyncStorage.getItem("sessionId")).replace(/['"]/g, '')
            },
            Data: {
                challengeId: challengeId,
            }
        }

        try {
            const response: any = await HotPocketClientService.submitContractReadRequest(message);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async leaveChallenge(challengeId: number) {
        const messageService = 'Challenge';
        const messageAction = 'LeaveChallenge';

        const message = {
            Service: messageService,
            Action: messageAction,
            Auth: {
                sessionId: (await AsyncStorage.getItem("sessionId")).replace(/['"]/g, '')
            },
            Data: {
                challengeId: challengeId,
            }
        }

        try {
            const response: any = await HotPocketClientService.submitInputToContract(message);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async joinChallengeviaInvitationCode(invitationCode: string) {
        const messageService = 'Challenge';
        const messageAction = 'JoinChallenge';
        const message = {
            Service: messageService,
            Action: messageAction,
            data: {
                invitationCode: invitationCode
            },
            Auth: {
                sessionId: (await AsyncStorage.getItem("sessionId")).replace(/['"]/g, '')
            }
        }

        try {
            const response  = (await HotPocketClientService.submitInputToContract(message)); // Returns the challenge Id
            return response;
        } catch (error) {
            console.log("error :",error);
            throw error as ErrorResponseDto
        }

    }
}
module ApplicationHelper
    def successful_sign_in_message
        # [NOTE] This string should be loaded dynamically. As is, this functionality will break
        # if Devise succesful sign-in message is customized, or if locale is changed
        return 'Signed in successfully.'
    end
end

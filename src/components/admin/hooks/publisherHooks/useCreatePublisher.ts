import { useMutation } from '@tanstack/react-query';

import { AdminService } from '../../services/publisher.service';

export const useCreatePublisher = () => {
    return useMutation({
        mutationFn: (formData: FormData) => AdminService.addAdminPublishers(formData),
        onSuccess: (data) => {
            console.log('Publisher created successfully:', data);
        }
    });
};

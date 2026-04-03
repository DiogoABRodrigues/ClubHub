import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "../services/NotificationService";
import { Notification } from "../models/Notification";

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Notification) =>
      NotificationService.create(data),

    onSuccess: () => {
      // opcional: atualizar lista se tiveres query de notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    createNotification: mutation.mutate,
    createNotificationAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
};
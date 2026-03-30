import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import messagesService from "../../../../../Services/Messages.service";
import "./ChatInput.scss";

type ChatInputProps = {
  receiverUserId: number | null;
};

type FormValues = {
  content: string;
};

function ChatInput({ receiverUserId }: ChatInputProps): ReactElement {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { content: "" },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!receiverUserId) {
        throw new Error("Missing receiver user id");
      }
      return messagesService.send({ receiverUserId, content });
    },
    onSuccess: () => {
      reset();
      if (receiverUserId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", receiverUserId],
        });
      }
    },
  });

  const onSubmit = handleSubmit(({ content }) => {
    if (!content.trim() || !receiverUserId) return;
    sendMessage.mutate(content.trim());
  });

  const isDisabled = !receiverUserId || sendMessage.isPending;

  return (
    <form className="ChatInput" onSubmit={onSubmit}>
      <input
        className="field"
        type="text"
        placeholder={
          receiverUserId ? "Type a message..." : "Select a user to start"
        }
        disabled={isDisabled}
        {...register("content")}
      />
      <button className="send" type="submit" disabled={isDisabled}>
        Send
      </button>
    </form>
  );
}

export default ChatInput;

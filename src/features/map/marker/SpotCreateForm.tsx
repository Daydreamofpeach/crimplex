import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";
import { Marker, Position, zMarker } from "@/server/config/schemas/Marker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const SpotCreateForm = ({
	onClose,
	...position
}: Position & {
	onClose: () => void;
}) => {
	const trpcUtils = trpc.useUtils();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Pick<Marker, "name">>({
		resolver: zodResolver(zMarker().pick({ name: true }).required()),
	});

	const { mutate: markerAdd, isLoading } = trpc.markers.create.useMutation({
		onSuccess: () => {
			trpcUtils.markers.invalidate();
			onClose();
		},
	});

	const onSubmit = (values: Pick<Marker, "name">) => {
		markerAdd({ ...values, position });
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full justify-center"
		>
			<div className="grid max-w-sm gap-3">
				<div className="grid gap-1">
					<Label htmlFor="name">Name</Label>
					<Input id="name" autoFocus {...register("name")} />
					{errors?.name && (
						<p className="text-red-500">{errors.name.message}</p>
					)}
				</div>
				<Button
					variant="secondary"
					type="submit"
					disabled={!!errors.name || isLoading}
					isLoading={isLoading}
				>
					Create
				</Button>
			</div>
		</form>
	);
};

export default SpotCreateForm;

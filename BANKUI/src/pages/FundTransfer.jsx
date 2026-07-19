import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MoneyForm from '../components/MoneyForm';
import { useLoader } from '../context/LoaderContext';
import { fundTransfer } from '../services/api';
import { errorMessage } from '../lib/http';

export default function FundTransfer() {
  const navigate = useNavigate();
  const loader = useLoader();

  const handleSubmit = async ({ amount, pin, targetAccountNumber }, reset) => {
    loader.show('Transferring funds...');
    try {
      const { data } = await fundTransfer(amount, pin, targetAccountNumber);
      loader.hide();
      reset();
      toast.success(data.msg || 'Fund transfer successful');
      navigate('/dashboard');
      console.log('Fund transfer successful!', data);
    } catch (error) {
      loader.hide();
      toast.error(errorMessage(error, 'Fund transfer failed'));
      console.error('Fund transfer failed:', error);
    }
  };

  return (
    <MoneyForm
      title="Send money"
      subtitle="Transfer to another OneStop account."
      icon="fa-exchange-alt"
      buttonLabel="Transfer"
      withTarget
      onSubmit={handleSubmit}
    />
  );
}

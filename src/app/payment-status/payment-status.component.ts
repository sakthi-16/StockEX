// Angular Component to handle payment result based on redirect from FPX backend

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'payment-status',
  standalone:true,
  imports:[CommonModule,FormsModule,RouterModule],
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {
  debitAuthCode: string = '';
  transactionId: string = '';
  sellerOrderNo: string = '';
  txnDate: string = '';
  txnTime: string = '';
  currency:string ='';
  amount: string = '';
  message: string = '';
status: 'success' | 'failure' = 'success';

  codeMap: { [key: string]: string } = {
    '00': 'Payment Successful',
    '03': 'Invalid Merchant',
    '05': 'Invalid Seller Or Acquiring Bank Code',
    '09': 'Transaction Pending',
    '12': 'Invalid Transaction',
    '13': 'Invalid Amount',
    '14': 'Invalid Buyer Account',
    '20': 'Invalid Response',
    '30': 'Format Error',
    '31': 'Invalid Bank',
    '39': 'No Credit Account',
    '45': 'Duplicate Seller Order Number',
    '46': 'Invalid Seller Exchange Or Seller',
    '47': 'Invalid Currency',
    '48': 'Maximum Transaction Limit Exceeded',
    '49': 'Merchant Specific Limit Exceeded',
    '50': 'Invalid Seller for Merchant Specific Limit',
    '51': 'Insufficient Funds',
    '53': 'No Buyer Account Number',
    '57': 'Transaction Not Permitted',
  '58': 'Transaction To Merchant Not Permitted',
  '70': 'Invalid Serial Number',
  '76': 'Transaction Not Found',
  '77': 'Invalid Buyer Name Or Buyer ID',
  '78': 'Decryption Failed',
  '79': 'Host Decline When Down',
  '80': 'Buyer Cancel Transaction',
  '83': 'Invalid Transaction Model',
  '84': 'Invalid Transaction Type',
  '85': 'Internal Error At Bank System',
  '87': 'Debit Failed Exception Handling',
  '88': 'Credit Failed Exception Handling',
  '89': 'Transaction Not Received Exception Handling',
  '90': 'Bank Internet Banking Unavailable',
  '92': 'Invalid Buyer Bank',
  '96': 'System Malfunction',
  '98': 'MAC Error',
  '99': 'Pending Authorization (Applicable for B2B model)',
  'BB': 'Blocked Bank',
  'BC': 'Transaction Cancelled By Customer',
  'DA': 'Invalid Application Type',
  'DB': 'Invalid Email Format',
  'DC': 'Invalid Maximum Frequency',
  'DD': 'Invalid Frequency Mode',
  'DE': 'Invalid Expiry Date',
  'DF': 'Invalid e-Mandate Buyer Bank ID',
  'FE': 'Internal Error',
  'OE': 'Transaction Rejected As Not In FPX Operating Hours',
  'OF': 'Transaction Timeout',
  'SB': 'Invalid Acquiring Bank Code',
  'XA': 'Invalid Source IP Address (B2B2 model)',
  'XB': 'Invalid Seller Exchange IP',
  'XC': 'Seller Exchange Encryption Error',
  'XE': 'Invalid Message',
  'XF': 'Invalid Number Of Orders',
  'XI': 'Invalid Seller Exchange',
  'XM': 'Invalid FPX Transaction Model',
  'XN': 'Transaction Rejected Due To Duplicate Seller Exchange Order Number',
  'XO': 'Duplicate Exchange Order Number',
  'XS': 'Seller Does Not Belong To Exchange',
  'XT': 'Invalid Transaction Type',
  'XW': 'Seller Exchange Date Difference Exceeded',
  '1A': 'Buyer Session Timeout At Internet Banking Login Page',
  '1B': 'Buyer Failed To Provide Info To Login At IB Login Page',
  '1C': 'Buyer Choose Cancel At Login Page',
  '1D': 'Buyer Session Timeout At Account Selection Page',
  '1E': 'Buyer Failed To Provide Info At Account Selection Page',
  '1F': 'Buyer Choose Cancel At Account Selection Page',
  '1G': 'Buyer Session Timeout At TAC Request Page',
  '1H': 'Buyer Failed To Provide Info At TAC Request Page',
  '1I': 'Buyer Choose Cancel At TAC Request Page',
  '1J': 'Buyer Session Timeout At Confirmation Page',
  '1K': 'Buyer Failed To Provide Info At Confirmation Page',
  '1L': 'Buyer Choose Cancel At Confirmation Page',
  '1M': 'Internet Banking Session Timeout',
  '2A': 'Transaction Amount Is Lower Than Minimum Limit',
  '2X': 'Transaction Is Canceled By Merchant'
    
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      this.debitAuthCode = params['code'] || '';
      this.transactionId = params['id'] || '';
      this.sellerOrderNo = params['order'] || '';
      this.txnDate = params['date'] || '';
      this.txnTime = params['time'] || '';
      this.amount = params['amount'] || '';
            this.currency = params['currency'] || '';


      this.message = this.codeMap[this.debitAuthCode] || 'Unknown status';
      this.status = this.debitAuthCode === '00' ? 'success' : 'failure';
    });
  }
}

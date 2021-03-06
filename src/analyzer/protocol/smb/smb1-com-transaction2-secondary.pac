refine connection SMB_Conn += {

	function proc_smb1_transaction2_secondary_request(header: SMB_Header, val: SMB1_transaction2_secondary_request): bool
	%{
	if ( ! smb1_transaction2_secondary_request )
		return false;

	RecordVal* args = new RecordVal(BifType::Record::SMB1::Trans2_Sec_Args);
	args->Assign(0, val_mgr->GetCount(${val.total_param_count}));
	args->Assign(1, val_mgr->GetCount(${val.total_data_count}));
	args->Assign(2, val_mgr->GetCount(${val.param_count}));
	args->Assign(3, val_mgr->GetCount(${val.param_offset}));
	args->Assign(4, val_mgr->GetCount(${val.param_displacement}));
	args->Assign(5, val_mgr->GetCount(${val.data_count}));
	args->Assign(6, val_mgr->GetCount(${val.data_offset}));
	args->Assign(7, val_mgr->GetCount(${val.data_displacement}));
	args->Assign(8, val_mgr->GetCount(${val.FID}));

	StringVal* parameters = new StringVal(${val.parameters}.length(), (const char*)${val.parameters}.data());
	StringVal* payload = new StringVal(${val.data}.length(), (const char*)${val.data}.data());

	BifEvent::generate_smb1_transaction2_secondary_request(bro_analyzer(),
	                                                       bro_analyzer()->Conn(),
	                                                       BuildHeaderVal(header),
	                                                       args,
	                                                       parameters,
	                                                       payload);

	return true;
	%}
};

type SMB1_transaction2_secondary_request(header: SMB_Header) = record {
	word_count          : uint8;
	total_param_count   : uint16;
	total_data_count    : uint16;
	param_count         : uint16;
	param_offset        : uint16;
	param_displacement  : uint16;
	data_count          : uint16;
	data_offset         : uint16;
	data_displacement   : uint16;
	FID                 : uint16;

	byte_count          : uint16;
	pad1                : padding to (param_offset - SMB_Header_length);
	parameters          : bytestring &length = param_count;
	pad2                : padding to (data_offset - SMB_Header_length);
	data                : bytestring &length=data_count;
} &let {
	proc : bool = $context.connection.proc_smb1_transaction2_secondary_request(header, this);
};

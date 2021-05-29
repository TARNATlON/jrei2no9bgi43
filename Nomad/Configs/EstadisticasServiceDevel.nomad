{
	"Stop": false,
	"Region": "eu-west-1",
	"Namespace": "default",
	"ID": "EstadisticasServiceDevel",
	"ParentID": "",
	"Name": "EstadisticasServiceDevel",
	"Type": "service",
	"Priority": 50,
	"AllAtOnce": false,
	"Datacenters": [
		"eu-west-1a",
		"eu-west-1b",
		"eu-west-1c"
	],
	"Constraints": null,
	"Affinities": null,
	"Spreads": [
		{
			"Attribute": "${node.unique.id}",
			"Weight": 100,
			"SpreadTarget": null
		}
	],
	"TaskGroups": [
		{
			"Name": "EstadisticasServiceDevel",
			"Count": 1,
			"Update": {
				"Stagger": 10000000000,
				"MaxParallel": 1,
				"HealthCheck": "checks",
				"MinHealthyTime": 30000000000,
				"HealthyDeadline": 600000000000,
				"ProgressDeadline": 900000000000,
				"AutoRevert": true,
				"AutoPromote": false,
				"Canary": 0
			},
			"Migrate": {
				"MaxParallel": 1,
				"HealthCheck": "checks",
				"MinHealthyTime": 10000000000,
				"HealthyDeadline": 300000000000
			},
			"Constraints": [
				{
					"LTarget": "",
					"RTarget": "",
					"Operand": "distinct_hosts"
				},
				{
					"LTarget": "${attr.cpu.arch}",
					"RTarget": "amd64",
					"Operand": "="
				}
			],
			"Scaling": null,
			"RestartPolicy": {
				"Attempts": 20,
				"Interval": 240000000000,
				"Delay": 10000000000,
				"Mode": "delay"
			},
			"Tasks": [
				{
					"Name": "EstadisticasServiceDevel",
					"Driver": "exec",
					"User": "",
					"Config": {
						"args": [
							"local/EstadisticasService/ACBEstadisticasService.dll"
						],
						"command": "dotnet"
					},
					"Env": {
						"KEST_PORT": "${NOMAD_PORT_http}",
						"RED_HOST": "redis-devel.acb.com",
						"RED_PORT": "6379",
						"DB_NAME": "ACB-DEVEL",
						"DB_PASS": "Ei4ooPeor7os2wu",
						"DB_SERVER": "acb-db-devel.acb.com",
						"DB_USER": "acbdbcli",
						"ENVIROMENT": "Dev"
					},
					"Services": [
						{
							"Name": "EstadisticasServiceDevel",
							"TaskName": "",
							"PortLabel": "http",
							"AddressMode": "auto",
							"EnableTagOverride": false,
							"Tags": null,
							"CanaryTags": null,
							"Checks": [
								{
									"Name": "Check Personas Service HTTP port",
									"Type": "tcp",
									"Command": "",
									"Args": null,
									"Path": "",
									"Protocol": "",
									"PortLabel": "",
									"Expose": false,
									"AddressMode": "",
									"Interval": 10000000000,
									"Timeout": 2000000000,
									"InitialStatus": "",
									"TLSSkipVerify": false,
									"Method": "",
									"Header": null,
									"CheckRestart": null,
									"GRPCService": "",
									"GRPCUseTLS": false,
									"TaskName": "",
									"SuccessBeforePassing": 0,
									"FailuresBeforeCritical": 0
								}
							],
							"Connect": null,
							"Meta": null,
							"CanaryMeta": null
						}
					],
					"Vault": null,
					"Templates": null,
					"Constraints": null,
					"Affinities": null,
					"Resources": {
						"CPU": 250,
						"MemoryMB": 350,
						"DiskMB": 0,
						"IOPS": 0,
						"Networks": [
							{
								"Mode": "",
								"Device": "",
								"CIDR": "",
								"IP": "",
								"MBits": 10,
								"DNS": null,
								"ReservedPorts": null,
								"DynamicPorts": [
									{
										"Label": "http",
										"Value": 0,
										"To": 0,
										"HostNetwork": "default"
									}
								]
							}
						],
						"Devices": null
					},
					"RestartPolicy": {
						"Attempts": 20,
						"Interval": 240000000000,
						"Delay": 10000000000,
						"Mode": "delay"
					},
					"DispatchPayload": null,
					"Lifecycle": null,
					"Meta": null,
					"KillTimeout": 5000000000,
					"LogConfig": {
						"MaxFiles": 10,
						"MaxFileSizeMB": 10
					},
					"Artifacts": [
						{
							"GetterSource": "s3::https://s3-eu-west-1.amazonaws.com/acb-devel-pkf/DEV/API-DEVEL/EstadisticasService_v0.5.7.tar.gz",
							"GetterOptions": {
								"aws_access_key_id": "AKIAU6HG43FW2CJY2QRI",
								"aws_access_key_secret": "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"
							},
							"GetterMode": "any",
							"RelativeDest": "local/"
						}
					],
					"Leader": false,
					"ShutdownDelay": 0,
					"VolumeMounts": null,
					"KillSignal": "",
					"Kind": "",
					"CSIPluginConfig": null
				}
			],
			"EphemeralDisk": {
				"Sticky": false,
				"SizeMB": 300,
				"Migrate": false
			},
			"Meta": null,
			"ReschedulePolicy": {
				"Attempts": 0,
				"Interval": 0,
				"Delay": 30000000000,
				"DelayFunction": "exponential",
				"MaxDelay": 3600000000000,
				"Unlimited": true
			},
			"Affinities": null,
			"Spreads": null,
			"Networks": null,
			"Services": null,
			"Volumes": null,
			"ShutdownDelay": null,
			"StopAfterClientDisconnect": null
		}
	],
	"Update": {
		"Stagger": 10000000000,
		"MaxParallel": 1,
		"HealthCheck": "",
		"MinHealthyTime": 0,
		"HealthyDeadline": 0,
		"ProgressDeadline": 0,
		"AutoRevert": false,
		"AutoPromote": false,
		"Canary": 0
	},
	"Multiregion": null,
	"Periodic": null,
	"ParameterizedJob": null,
	"Dispatched": false,
	"Payload": null,
	"Meta": null,
	"ConsulToken": "",
	"VaultToken": "",
	"VaultNamespace": "",
	"NomadTokenID": "",
	"Status": "running",
	"StatusDescription": "",
	"Stable": true,
	"Version": 244,
	"SubmitTime": 1621631677541900300,
	"CreateIndex": 96405,
	"ModifyIndex": 505953,
	"JobModifyIndex": 505868
}